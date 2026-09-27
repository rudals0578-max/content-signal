# 📊 CONTENT SIGNAL

### 데이터 속에서 다음 콘텐츠의 신호를 찾다

> **높은 시청률만이 가치 있는 콘텐츠를 의미할까?**  
> 시청률 · 시청자 타깃 · 온라인 반응 데이터를 함께 분석해  
> 콘텐츠에 숨어 있는 다양한 신호를 발견하는 데이터 기반 콘텐츠 분석 서비스입니다.

<p align="center">
  <b>DATA ANALYSIS → CONTENT PLANNING → BUSINESS REVIEW</b>
</p>

---

## 🎯 01. Project Background
<img width="1280" height="720" alt="슬라이드4" src="https://github.com/user-attachments/assets/4f7e15e4-bfe7-47af-85d1-ee68aa3fdf7b" />

방송 콘텐츠의 성과는 주로 **시청률**을 중심으로 평가되어 왔습니다.

하지만 디지털 환경에서는 시청률뿐만 아니라  
**게시글, 댓글, 동영상 조회수, 뉴스 반응, 2049 시청률** 등  
다양한 데이터에서 콘텐츠의 또 다른 가치가 나타날 수 있습니다.

CONTENT SIGNAL은 이러한 데이터를 함께 분석하여  
**시청률만으로 발견하기 어려운 콘텐츠의 신호를 탐색**하는 것을 목표로 합니다.

### 💡 핵심 질문

> **TV 시청률이 낮더라도 온라인에서 강한 반응을 얻는 콘텐츠가 존재하지 않을까?**

---

## 📂 02. Data & EDA

### 📌 Data Source

본 프로젝트는 **RACOI 방송 콘텐츠 반응 데이터**를 활용했습니다.
<img width="1280" height="720" alt="슬라이드7" src="https://github.com/user-attachments/assets/c8c2dea5-4edb-4674-9a56-c3bc450b7eea" />

### 🔎 Data Processing

- Excel 데이터 로드 및 구조 확인
- Multi Header 데이터 정리
- 필요한 컬럼 추출
- 숫자형 데이터 변환
- 결측치 및 중복 데이터 확인
- 프로그램 단위 데이터 구조화
- 지표 간 상관관계 분석
- Percentile 기반 프로그램 비교

<img width="1280" height="720" alt="슬라이드8" src="https://github.com/user-attachments/assets/6998fdde-e3bb-44ce-9aab-e6a34b8ef8dc" />

| Signal | 주요 데이터 |
| --- | --- |
| 📺 **TV SIGNAL** | 가구 시청률, 2049 시청률 |
| 👥 **TARGET SIGNAL** | 시청자 타깃 데이터 |
| 💬 **DIGITAL SIGNAL** | 게시글, 댓글, 동영상 조회수, 뉴스 |
| 📈 **WEEKLY SIGNAL** | 프로그램별 주차별 반응 변화 |


### 📊 EDA Result

EDA 결과, **TV 시청률과 DIGITAL 반응은 항상 같은 방향으로 움직이지 않았습니다.**

특히 일부 프로그램에서는 상대적으로 낮은 TV 시청률에도  
높은 게시글·댓글·동영상 조회 반응이 나타나는 사례를 확인했습니다.

또한 본 데이터에서는 **2049 시청률이 가구 시청률보다 게시글 수와 동영상 조회수에 더 높은 상관관계**를 보였습니다.

> 💡 **시청률 하나만으로는 설명하기 어려운 콘텐츠의 또 다른 신호가 존재할 수 있다.**
> <img width="1280" height="720" alt="슬라이드11" src="https://github.com/user-attachments/assets/dc89b406-a076-4a87-a650-5e6c77dd0e9b" />

---

## 🔍 03. CONTENT SIGNAL

### 콘텐츠의 다양한 반응 신호를 한 화면에서 분석

CONTENT SIGNAL은 프로그램별 데이터를 분석하여  
**TV · TARGET · DIGITAL 신호를 함께 비교**할 수 있도록 구성했습니다.

단순 수치 비교가 아니라 **Percentile 기반 상대적 위치**를 활용해  
전체 프로그램 가운데 해당 콘텐츠가 어느 수준의 신호를 가지고 있는지 확인합니다.

<img width="1280" height="720" alt="슬라이드12" src="https://github.com/user-attachments/assets/17972be7-ece0-4712-b33d-d4f4760809cd" />

### ✨ 주요 기능

- 🔎 프로그램 검색 및 분석
- 📺 TV 시청률 분석
- 👥 타깃 시청자 분석
- 💬 온라인 반응 분석
- 📊 Percentile 기반 비교
- 📈 주차별 반응 변화 시각화
- 💭 댓글 키워드 및 감성 결과 시각화

### 🧪 DEMO PROGRAM

상세 분석 데이터가 구축된 4개 프로그램을 통해  
각기 다른 콘텐츠 신호를 확인할 수 있습니다.

| 프로그램 | 확인 포인트 |
| --- | --- |
| **김부장** | TV + DIGITAL 종합 분석 |
| **신입사원 강회장** | WEEKLY SIGNAL |
| **스트릿 월드 파이터 : 디렉터스 워** | DIGITAL SIGNAL |
| **유 퀴즈 온 더 블럭** | COMMENT SIGNAL |

### 🖥️ Service Preview

<img width="1280" height="720" alt="슬라이드13" src="https://github.com/user-attachments/assets/83bd1685-7ba5-4f58-ba9e-0f3c18b1a1b0" />
<img width="1280" height="720" alt="슬라이드14" src="https://github.com/user-attachments/assets/e160d99e-3e00-48af-bb5c-3e75d3b7c6a4" />



### 🎬 CONTENT SIGNAL Demo

<!-- 여기에 CONTENT SIGNAL MP4 영상을 GitHub에서 드래그해서 넣으세요 -->

---

## 💡 04. CREATIVE SIGNAL

### 분석 데이터를 콘텐츠 기획 인사이트로 확장

분석에서 끝나는 것이 아니라  
발견된 데이터 신호를 **다음 콘텐츠 기획을 위한 참고 정보**로 확장했습니다.

현재 데이터에서 나타난 프로그램의 특징과 반응 패턴을 바탕으로  
기획자가 새로운 콘텐츠 방향을 탐색할 수 있도록 구성했습니다.

### ✨ 주요 기능

- 📊 데이터 기반 콘텐츠 패턴 확인
- 🔍 분석 프로그램과 연계
- 🤖 AI 기반 기획 인사이트 생성
- 💡 데이터 신호를 콘텐츠 기획 관점으로 확장

### 🤖 AI Insight

AI 모델을 직접 개발한 것이 아니라,  
**AI API를 FastAPI 백엔드를 통해 서비스에 연동**했습니다.

분석 데이터를 AI에 전달하여  
데이터에서 확인 가능한 범위 안에서 콘텐츠 기획 인사이트를 생성합니다.

> **DATA → SIGNAL → CREATIVE INSIGHT**

### 🖥️ Service Preview

<img width="1280" height="720" alt="슬라이드16" src="https://github.com/user-attachments/assets/420984ed-4bde-497f-a8c7-0fcb67693e35" />
<img width="1280" height="720" alt="슬라이드18" src="https://github.com/user-attachments/assets/252bf8ca-5c33-4465-a452-5c11e86b5cec" />

### 🎬 CREATIVE SIGNAL Demo

<!-- 여기에 CREATIVE SIGNAL MP4 영상을 GitHub에서 드래그해서 넣으세요 -->

---

## 💼 05. BUSINESS SIGNAL

### 콘텐츠 분석 결과를 광고·협찬 검토 영역으로 확장

BUSINESS SIGNAL은 광고주의 조건을 입력하면  
해당 조건을 데이터 분석 기준으로 변환하여  
검토할 수 있는 프로그램 후보를 탐색합니다.

### 🎯 분석 조건

- 업종
- 목표 연령
- 목표 성별
- 캠페인 목적
- 중요 지표

### 📊 활용 지표

- **DIGITAL** — 온라인 반응
- **TARGET** — 타깃 적합도
- **RATING** — 시청률

> BUSINESS SIGNAL의 점수와 가중치는 광고 효과나 수익을 예측하는 값이 아니라  
> **후보 프로그램 탐색을 위한 서비스 기준**입니다.

### 🖥️ Service Preview
<img width="1280" height="720" alt="슬라이드19" src="https://github.com/user-attachments/assets/f05d8c67-dc4a-41f1-8b76-3cd100c23700" />
<img width="1280" height="720" alt="슬라이드20" src="https://github.com/user-attachments/assets/b5df50e5-a3a7-46c7-b616-fd02db8787f1" />
<img width="1280" height="720" alt="슬라이드21" src="https://github.com/user-attachments/assets/1e0733a2-89ba-436a-8982-892552627d38" />




### 🎬 BUSINESS SIGNAL Demo

<!-- 여기에 BUSINESS SIGNAL MP4 영상을 GitHub에서 드래그해서 넣으세요 -->

---

## 🔄 06. System Flow

<pre>
RACOI Excel Data
        ↓
Python / pandas
        ↓
Data Cleaning & EDA
        ↓
FastAPI
        ↓
REST API
        ↓
React + Axios
        ↓
Recharts Visualization
        ↓
CONTENT SIGNAL
        ↓
CREATIVE SIGNAL
        ↓
BUSINESS SIGNAL
</pre>

---

## 🛠️ 07. Tech Stack

### 📊 Data Analysis

`Python` · `pandas` · `Jupyter Notebook` · `Excel`

### ⚙️ Backend

`FastAPI` · `Uvicorn` · `OpenAI API`

### 🖥️ Frontend

`React` · `JavaScript` · `Axios` · `Recharts`

### 🔧 Development

`VS Code` · `Git` · `GitHub`

---

## 📁 08. Project Structure

<pre>
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
</pre>

---

## 🚀 09. How to Run

### ⚙️ Backend

<pre>
pip install fastapi uvicorn pandas openpyxl python-dotenv openai
python -m uvicorn backend.main:app --reload
</pre>

FastAPI 실행 후 Swagger에서 API를 확인할 수 있습니다.

<pre>
http://127.0.0.1:8000/docs
</pre>

### 🖥️ Frontend

<pre>
cd frontend/React
npm install
npm run dev
</pre>

실행 후 브라우저에서 확인합니다.

<pre>
http://localhost:5173
</pre>

---

## 🔐 10. AI API

AI 기능을 사용하려면 프로젝트 루트에 `.env` 파일을 생성하고  
API Key를 설정해야 합니다.

<pre>
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
</pre>

> ⚠️ 실제 API Key는 GitHub Repository에 포함하지 않습니다.  
> `.env` 파일은 `.gitignore`를 통해 Git 추적에서 제외합니다.

AI 기능을 제외한 기본 데이터 분석 기능은 별도로 확인할 수 있습니다.

---

## 🔮 11. Future Development

현재 프로젝트는 방송 콘텐츠 데이터를 중심으로 구성되어 있으며  
향후 다음과 같은 방향으로 확장할 수 있습니다.

- 📺 방송 데이터 범위 확대
- 🎬 OTT 콘텐츠 데이터 연계
- 💬 댓글 및 소셜 반응 데이터 확대
- 📊 분석 지표 고도화
- 🤖 AI 기획 인사이트 고도화
- 💼 광고·협찬 검토 데이터 확장

---

## 📊 CONTENT SIGNAL

> **콘텐츠의 가치는 하나의 숫자로 설명되지 않습니다.**

시청률 · 타깃 · 온라인 반응 데이터를 함께 분석해  
콘텐츠에 숨어 있는 다양한 신호를 발견합니다.

### DATA ANALYSIS → CONTENT PLANNING → BUSINESS REVIEW

**Thank you.**
