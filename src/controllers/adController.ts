import { Response } from 'express';
import fs from 'fs';
import path from 'path';

// main page의 광고 파일 이름 반환
export const getAdMain = async (req: any, res: Response) => {
  const query = `SELECT * FROM tb_file WHERE id = 1`;
  const row = req.db.prepare(query).all(); // 조회시에는 all method 사용
  console.log('row', row);
  res.send({ path: row[0].name });
};

// 서버에 업로드되어 있는 광고 파일(영상, 이미지) 목록 반환
export const getAdList = async (req: any, res: Response) => {
  try {
    const files = fs.readdirSync('src/dist/');
    const mediaFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.avi', '.mov'].includes(ext);
    });
    console.log('mediaFiles', mediaFiles);
    return res.json({ adList: mediaFiles });
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
  }
};

// main page에 띄울 파일 변경
export const changeAdMain = async (req: any, res: Response) => {
  console.log('body', req.body);
  const { fileName } = req.body;
  const db = req.db;

  const query = `UPDATE tb_file SET name = ? WHERE id = 1`;
  db.prepare(query).run(fileName); // ? 를 fileName으로 바인딩

  // SSE로 연결되어 있는 클라이언트들 새로고침
  req.SSEClients.forEach((client: any) => client.write('data: refresh\n\n'));

  return res.json({});
};
