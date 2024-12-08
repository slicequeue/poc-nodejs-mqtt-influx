/**
 * SensorData 클래스
 * - 센서 데이터의 전체 구조를 나타냅니다.
 * - 각 데이터 항목은 SensorMeasurement 클래스로 표현됩니다.
 */
class SensorData {
  /**
   * SensorData 생성자
   * @param {string} uid - 센서의 고유 ID (예: 'B0:A7:32:DB:61:18').
   * @param {string} at - 데이터 수집 시간(ISO 8601 형식, 예: '2024-12-07T18:17:07+0100').
   * @param {Array<Object>} data - 측정 데이터 배열. 각 항목은 { type, value, unit } 구조를 가져야 합니다.
   */
  constructor({uid, at, data}) {
    this.uid = uid; // 센서의 고유 ID를 저장.
    this.at = new Date(at); // 데이터 수집 시간을 JavaScript Date 객체로 변환.
    this.data = data.map(
      (item) => new SensorMeasurement(item.type, item.value, item.unit)
    ); // 데이터 배열을 SensorMeasurement 객체 배열로 변환.
  }

  /**
   * 데이터 검증 메서드
   * - 객체의 모든 필드가 유효한지 확인합니다.
   * @throws {Error} 유효하지 않은 데이터가 있을 경우 예외를 발생시킵니다.
   */
  validate() {
    if (!this.uid) throw new Error('UID is required'); // uid 필드가 존재하지 않을 경우 예외.
    if (!(this.at instanceof Date) || isNaN(this.at.getTime()))
      throw new Error('Invalid timestamp'); // 타임스탬프가 유효하지 않은 경우 예외.
    if (!Array.isArray(this.data))
      throw new Error('Data must be an array'); // data 필드가 배열이 아닌 경우 예외.

    // 각 데이터 항목에 대해 검증 수행.
    this.data.forEach((item) => item.validate());
  }
}

/**
 * SensorMeasurement 클래스
 * - 센서의 개별 측정 데이터를 나타냅니다.
 */
class SensorMeasurement {
  /**
   * SensorMeasurement 생성자
   * @param {string} type - 측정 유형 (예: 'humidity', 'temperature', 'soil-moisture').
   * @param {number} value - 측정 값 (예: 35, 25.8, 0).
   * @param {string} unit - 측정 단위 (예: '%', 'C').
   */
  constructor(type, value, unit) {
    this.type = type; // 측정 유형을 저장 (예: 'humidity').
    this.value = value; // 측정 값을 저장 (예: 35).
    this.unit = unit; // 측정 단위를 저장 (예: '%').
  }

  /**
   * 데이터 검증 메서드
   * - 객체의 모든 필드가 유효한지 확인합니다.
   * @throws {Error} 유효하지 않은 데이터가 있을 경우 예외를 발생시킵니다.
   */
  validate() {
    if (!this.type) throw new Error('Measurement type is required'); // type 필드가 존재하지 않을 경우 예외.
    if (typeof this.value !== 'number')
      throw new Error('Measurement value must be a number'); // value 필드가 숫자가 아닐 경우 예외.
    if (!this.unit) throw new Error('Measurement unit is required'); // unit 필드가 존재하지 않을 경우 예외.
  }
}

// 모듈로 내보내기
module.exports = { SensorData, SensorMeasurement };
