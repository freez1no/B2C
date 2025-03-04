export const fetchSurveyData = async (): Promise<Array<{ id: number; question: string }>> => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID_HERE/values/Sheet1!A:B?key=${GoogleApiKey}`
    );
    const json = await response.json();
    // 첫 번째 행이 헤더라고 가정 후 나머지 행을 데이터로 변환
    const rows = json.values;
    const data = rows.slice(1).map((row: string[]) => ({
      id: Number(row[0]),
      question: row[1],
    }));
    return data;
  } catch (error) {
    console.error("Sheets API error:", error);
    throw error;
  }
};

export const updateSheetResponse = async (responseText: string): Promise<boolean> => {
  try {
    // 현재 시각과 응답 텍스트를 함께 기록 (필요에 따라 다른 형식으로 기록 가능)
    const timestamp = new Date().toISOString();
    const values = [[timestamp, responseText]];
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID_HERE/values/Sheet1!A:B:append?valueInputOption=USER_ENTERED&key=%EACT_APP_GOOGLE_CLOUD_API_KEY%`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      }
    );
    const json = await response.json();
    if (json.updates) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Sheets update error:', error);
    return false;
  }
};
