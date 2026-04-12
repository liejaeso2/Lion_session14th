import ProfileCard from './ProfileCard';

function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
      <ProfileCard
        name="소재일"
        age={24}
        dream="프론트엔드 개발자"
        emoji="🧑‍💻"
        hobby="드라마 시청"
        mbti="ISTP"
        intro="안녕하세요! 저는 멋쟁이 사자 프론트엔드 소재일입니다."
      />
    </div>
  );
}

export default App;