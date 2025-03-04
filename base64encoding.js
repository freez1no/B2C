import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';

export const encodeFileToBase64 = async (filePath) => {
  try {
    // 'ascii'로 읽어 raw binary string을 얻은 후, Buffer를 이용해 base64 인코딩
    const rawData = await RNFS.readFile(filePath, 'ascii');
    const base64Data = Buffer.from(rawData, 'binary').toString('base64');
    return base64Data;
  } catch (error) {
    console.error("Error in base64 encoding:", error);
    throw error;
  }
};
