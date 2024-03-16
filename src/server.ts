import express, { Request, Response, json, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import Database from 'better-sqlite3';
import { changeAdMain, getAdList, getAdMain } from './controllers/adController';
import { fileUpload } from './middleware/upload';

const app: express.Application = express();
const port: number = 4000;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

// DB 연동
const db_name = path.join('ad-board.db');
const db = new Database(db_name, { verbose: () => console.log('query success') });
app.use((req, res, next) => {
  (req as any).db = db;
  next();
});

// build된 react web app 파일들을 제공
app.use(express.static(path.join(__dirname, 'dist')));

// Router
app.get('/', (request: Request, response: Response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// SSE Client 관리
let clients: Response[] = [];
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  clients.push(res);

  req.on('close', () => (clients = clients.filter((client) => client !== res)));
});
app.use((req, res, next) => {
  (req as any).SSEClients = clients;
  next();
});

// API
app.get('/ad/main', getAdMain);
app.post('/ad', fileUpload.single('file'), (_, res: Response) => res.json());
app.get('/ad/list', getAdList);
app.put('/ad/main', changeAdMain);

// Server Run
app.listen(port, () => console.log(`App is listening on port ${port} \n`));
