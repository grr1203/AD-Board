import './reset.css';
import './App.css';
import { useEffect, useState } from 'react';

const SERVER_URL = 'http://localhost:4000';

function App() {
  const [filePath, setFilePath] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');

  useEffect(() => {
    (async () => {
      const res = await fetch(`${SERVER_URL}/file/main`);
      const data = await res.json();

      setFilePath(data.path);
      setFileType(getFileType(data.path));
    })();
  }, []);

  return (
    <div className="MainContainer">
      <div className="VideoContainer">
        {fileType === 'video' ? (
          <video className="MainVideo" src={`/${filePath}`} autoPlay loop muted playsInline width={'100%'}>
            Your browser does not support the video tag.
          </video>
        ) : (
          <img className="MainImage" src={`/${filePath}`} alt="img" />
        )}
      </div>
    </div>
  );
}

export default App;

// 이미지 / 비디오 파일 타입 확인
function getFileType(fileName: string) {
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];
  const videoExtensions = ['mp4', 'mov', 'wmv', 'flv', 'avi', 'mkv', 'webm'];

  // 파일 확장자에 따라 파일 타입 결정
  const extension = fileName.split('.').pop()!.toLowerCase();
  if (imageExtensions.includes(extension)) return 'image';
  else if (videoExtensions.includes(extension)) return 'video';
  else return 'video'; // default
}