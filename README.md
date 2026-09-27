🛠️ 07. Tech Stack
📊 Data Analysis
Python pandas Jupyter Notebook Excel
⚙️ Backend
FastAPI Uvicorn OpenAI API
🖥️ Frontend
React JavaScript Axios Recharts
🔧 Development
VS Code Git GitHub
📁 08. Project Structure
content-signal/
│
├── analysis/
│   └── 01_data_check.ipynb
│
├── backend/
│   ├── analysis.py
│   └── main.py
│
├── data/
│   ├── raw/
│   └── processed/
│
├── frontend/
│   └── React/
│
├── .gitignore
└── README.md

🚀 09. How to Run
Backend
pip install fastapi uvicorn pandas openpyxl python-dotenv openai

python -m uvicorn backend.main:app --reload

FastAPI 실행 후 Swagger에서 API를 확인할 수 있습니다.
http://127.0.0.1:8000/docs

Frontend
cd frontend/React

npm install

npm run dev

실행 후 브라우저에서 확인합니다.
http://localhost:5173

🔐 10. AI API
AI 기능을 사용하려면 프로젝트 루트에 .env 파일을 생성하고
API Key를 설정해야 합니다.
OPENAI_API_KEY=YOUR_OPENAI_API_KEY

⚠️ 실제 API Key는 GitHub Repository에 포함하지 않습니다.
.env 파일은 .gitignore를 통해 Git 추적에서 제외합니다.

AI 기능을 제외한 기본 데이터 분석 기능은 별도로 확인할 수 있습니다.
🔮 11. Future Development
현재 프로젝트는 방송 콘텐츠 데이터를 중심으로 구성되어 있으며
향후 다음과 같은 방향으로 확장할 수 있습니다.
- 📺 방송 데이터 범위 확대
- 🎬 OTT 콘텐츠 데이터 연계
- 💬 댓글 및 소셜 반응 데이터 확대
- 📊 분석 지표 고도화
- 🤖 AI 기획 인사이트 고도화
- 💼 광고·협찬 검토 데이터 확장
📊 CONTENT SIGNAL
콘텐츠의 가치는 하나의 숫자로 설명되지 않습니다.

시청률 · 타깃 · 온라인 반응 데이터를 함께 분석해
콘텐츠에 숨어 있는 다양한 신호를 발견합니다.
DATA ANALYSIS → CONTENT PLANNING → BUSINESS REVIEW
Thank you.

### 지금 할 것

GitHub에서 **`README.md` → ✏️ Edit → 기존 내용 전체 선택 → 위 코드 전체 붙여넣기**까지만 해.

그리고 바로 Commit하지 말고 **`Preview`를 먼저 눌러봐.**

정상적으로 보이면 그다음부터 우리가 `🖼️ Project Background` 자리부터 **PPT 이미지를 하나씩 드래그해서 넣으면 돼.** 영상도 `🎬 Demo` 위치에 같은 방식으로 넣자.

그리고 지금 코드에서는 일부러 외부 기술 배지는 안 넣었어. **우선 이모지 + PPT + 서비스 이미지 + 영상으로 구성한 뒤**, 마지막에 Python/React/FastAPI 로고 배지만 상단에 추가하면 훨씬 깔끔해.
