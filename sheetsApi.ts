// sheetsApi.ts
export const fetchSurveyData = async (): Promise<string[]> => {
  // 실제 스프레드시트 ID, 범위, 인증 정보(API 키 또는 Bearer 토큰)를 입력하세요.
  const SPREADSHEET_ID = 'your-spreadsheet-id';
  const RANGE = 'Sheet1!A1:A'; // 예: A열에 설문 문항이 위치
  const API_KEY = '%REACT_APP_GOOGLE_CLOUD_API_KEY%';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sheets API error: ${response.statusText}`);
  }
  const data = await response.json();
  // 응답 구조에 따라 데이터를 가공 (values: string[][])
  if (data.values && data.values.length > 0) {
    // 각 행의 첫 번째 셀을 추출하여 배열로 반환
    return data.values.map((row: string[]) => row[0]);
  }
  return [];
};
