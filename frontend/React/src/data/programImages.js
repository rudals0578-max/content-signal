const programImages = {
  "김부장": "/images/programs/kim-manager.webp",
  "신입사원 강회장": "/images/programs/rookie-kang.webp",
  "사건반장": "/images/programs/case-chief.webp",
  "신병4: 사보타주": "/images/programs/new-recruit-4.webp",
  "유 퀴즈 온 더 블럭": "/images/programs/youquiz.webp",

  "멋진 신세계": "/images/programs/brave-new-world.webp",
  "사랑을 처방해드립니다": "/images/programs/love-prescription.webp",
  "취사병 전설이 되다": "/images/programs/legendary-cook.webp",

  "스트릿 월드 파이터 : 디렉터스 워":
    "/images/programs/street-world-fighter.webp",

  "한국기행": "/images/programs/korea-trip.jpg",

  // 포스터 이미지가 없어서 기본 이미지 사용
  "극한직업": "/images/programs/default.jpg",

  "하트시그널5": "/images/programs/heart-signal-5.webp",

  "더 시즌즈-성시경의 고막남친":
    "/images/programs/the-seasons.webp",

  "* 나 혼자 산다": "/images/programs/i-live-alone.webp",
  "사랑이 온다": "/images/programs/love-is-coming.webp",
  "유부녀 킬러": "/images/programs/married-woman-killer.webp",
  "언더커버 셰프": "/images/programs/undercover-chef.webp",
  "재벌X형사2": "/images/programs/flex-x-cop-2.webp",
};


// ========================================
// 프로그램명 정리
// ========================================
const normalizeProgramName = (name = "") => {
  return name
    .trim()
    .replace(/\*/g, "")
    .replace(/\s/g, "")
    .replace(/:/g, "")
    .replace(/-/g, "")
    .toLowerCase();
};


// ========================================
// 프로그램 이미지 가져오기
// ========================================
export const getProgramImage = (programName) => {
  const targetName = normalizeProgramName(programName);

  const matchedName = Object.keys(programImages).find(
    (name) => normalizeProgramName(name) === targetName
  );

  return matchedName
    ? programImages[matchedName]
    : "/images/programs/default.jpg";
};

export default programImages;