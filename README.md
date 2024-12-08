# Node.js & MQTT, InfluxDB - POC

이 프로젝트는 MQTT를 통해 IoT 디바이스에서 센서 데이터를 수신하고, InfluxDB에 저장하는 시스템의 개념 증명(Proof of Concept, POC)을 목적으로 합니다. 데이터 수집 및 저장 과정을 테스트하고 기술적 가능성을 확인하는 데 중점을 둡니다.

| ESP32 센서 데이터 측정 및 송신: https://github.com/slicequeue/poc-esp32-dht11-fc28-mqtt 이 작업을 통해 센서 측정 정보를 브로커에 송신합니다.

---

## 주요 내용

1. **목적**
   - IoT 디바이스에서 실시간으로 센서 데이터를 MQTT를 통해 수신.
   - 데이터 구조 검증 및 저장 성능 확인.
   - InfluxDB를 활용한 타임 시리즈 데이터 저장 가능성 검토.

2. **구성 요소**
   - **MQTT 브로커**: EMQX와 같은 MQTT 브로커를 사용하여 디바이스와 데이터 교환.
   - **InfluxDB**: 타임 시리즈 데이터 저장 및 관리.
   - **Node.js 애플리케이션**: MQTT 메시지를 수신하고 InfluxDB에 저장하는 역할.

---

## 설치 및 실행

1. **프로젝트 준비**
   ```bash
   git clone https://github.com/your-username/smart-plant-poc.git
   cd smart-plant-poc
   npm install
   ```

2. **환경 변수 설정**
   프로젝트 루트에 `.env` 파일을 생성하고 필요한 설정 값을 입력합니다.
   ```env
   MQTT_URL=<MQTT_브로커_URL>
   MQTT_TOPIC=<MQTT_토픽>
   INFLUX_URL=<INFLUXDB_접속_URL>
   INFLUX_TOKEN=<INFLUXDB_접속_TOKEN>
   INFLUX_ORG=<INFLUXDB_접속_ORGANIZATION>
   INFLUX_BUCKET=<INFLUXDB_접속_BUCKET>
   ```

3. **애플리케이션 실행**
   ```bash
   node app.js
   ```

---

## 메시지 구조

IoT 디바이스에서 전송하는 JSON 메시지의 예시는 다음과 같습니다:
```json
{
  "uid": "B0:A7:32:DB:61:18",
  "at": "2024-12-07T18:17:07+0100",
  "data": [
    { "type": "humidity", "value": 35, "unit": "%" },
    { "type": "temperature", "value": 25.8, "unit": "C" },
    { "type": "soil-moisture", "value": 0, "unit": "%" }
  ]
}
```

---

## 한계점 및 결과

1. **한계점**
   - 데이터 중복 처리 및 메시지 유효성 검증 추가 필요.
   - 대규모 데이터 처리 시 성능 테스트 미흡.
   - MQTT 브로커와 InfluxDB 간 연결 안정성 확인 부족.

2. **결과**
   - 실시간 데이터 수신 및 저장에 성공.
   - InfluxDB의 타임 시리즈 데이터 관리 기능 확인.
   - Node.js 기반의 데이터 처리 구조 검증.

---

## 사용 기술

- **MQTT.js**: MQTT 브로커와의 통신.
- **@influxdata/influxdb-client**: InfluxDB 데이터 쓰기 및 관리.
- **dotenv**: 환경 변수 관리.

---

## 앞으로의 계획

- 대량의 데이터 테스트 및 확장성 검증.
- 대시보드 및 모니터링 기능 추가.
- 데이터 중복 방지 및 에러 처리 강화. 

--- 

### 주의
이 코드는 프로토타입(PoC)으로, 운영 환경에서 사용하기 전에 추가적인 검토와 개선이 필요합니다.
