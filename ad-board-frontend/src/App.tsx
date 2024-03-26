import './reset.css';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [filePath, setFilePath] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');

  // default
  useEffect(() => {
    (async () => {
      // console.log('SERVER_URL', SERVER_URL);
      const res = await fetch(`/ad/main`);
      const data = await res.json();

      setFilePath(data.path);
      setFileType(getFileType(data.path));
    })();
  }, []);

  // Server-Sent Events (SSE)로 서버의 이벤트 처리
  useEffect(() => {
    const eventSource = new EventSource(`/events`);
    eventSource.onmessage = function (event) {
      console.log('Received message:', event.data);
      if (event.data === 'refresh') window.location.reload(); // 페이지 새로고침
    };
    eventSource.onerror = (error) => console.error('SSE Error:', error);

    // 컴포넌트가 언마운트될 때 SSE 연결 해제
    return () => eventSource.close();
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
