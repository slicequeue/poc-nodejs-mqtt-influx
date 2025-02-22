require('dotenv').config(); // .env 파일 로드
const mqtt = require("mqtt");
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { SensorData } = require('./dto/SensorDto');

// 환경변수에서 설정 로드
const mqttUrl = process.env.MQTT_URL;
const mqttTopic = process.env.MQTT_TOPIC;

// InfluxDB 설정
const influx = {
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
  org: process.env.INFLUX_ORG,
  bucket: process.env.INFLUX_BUCKET
};

// MQTT 클라이언트 생성
const mqttClient = mqtt.connect(mqttUrl);

// InfluxDB 클라이언트 생성
const client = new InfluxDB({ url: influx.url, token: influx.token });
const writeApi = client.getWriteApi(influx.org, influx.bucket);

// MQTT 연결
mqttClient.on('connect', () => {
  console.log('MQTT connected:', mqttClient.connected);

  mqttClient.subscribe(mqttTopic);
  mqttClient.on("message", (topic, message) => {
    try {
      const parsedMessage = JSON.parse(message);
      if (!parsedMessage.uid || !parsedMessage.at || !Array.isArray(parsedMessage.data)) {
        throw new Error('Invalid message format');
      }
  
      const sensorData = new SensorData(parsedMessage);
      sensorData.validate();
  
      const point = new Point('environment_data')
        .tag('uid', sensorData.uid)
        .timestamp(new Date(sensorData.at));
  
      sensorData.data.forEach(measurement => {
        point.floatField(measurement.type, measurement.value);
      });
  
      // 데이터 쓰기
      writeApi.writePoint(point);
  
      // 쓰기 완료 후 로그 (writePoint는 Promise를 반환하지 않으므로, 직접 성공 로그를 추가)
      console.log(`[${(new Date()).toISOString()}] Data written successfully for UID: ${sensorData.uid}`);
    } catch (err) {
      console.error('Error message:', err.message);
    }
  });
});

// 종료 처리
process.on('SIGINT', async () => {
  console.log('Closing connections...');
  await writeApi.close();
  mqttClient.end();
  console.log('Shutdown complete.');
  process.exit();
});
