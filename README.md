# CONTENT SIGNAL

> **데이터 속에서 다음 콘텐츠의 신호를 찾다.**

시청률 하나만으로 콘텐츠의 가치를 판단하는 대신,\
**TV 시청률 · 시청자 타깃 · 온라인 반응 데이터를 함께 분석하여 콘텐츠에
숨어 있는 다양한 신호를 발견하는 데이터 기반 콘텐츠 분석 서비스**입니다.

분석 결과를 기존 콘텐츠 분석에 그치지 않고 **콘텐츠 기획(CREATIVE
SIGNAL)**과 **광고·협찬 검토(BUSINESS SIGNAL)**까지 연결할 수 있도록
구현했습니다.

------------------------------------------------------------------------

## 01. Project Background

### 높은 시청률만이 가치 있는 콘텐츠를 의미할까?

미디어 이용 환경이 다양해지면서 콘텐츠에 대한 반응 역시 TV 시청률
하나만으로 설명하기 어려워졌습니다.

CONTENT SIGNAL은 다음 데이터를 함께 살펴봅니다.

-   **TV SIGNAL** --- 가구 시청률 및 연령·성별 시청률
-   **TARGET SIGNAL** --- 연령·성별 시청 데이터
-   **DIGITAL SIGNAL** --- 게시글, 댓글, 동영상 조회, 뉴스 반응
-   **WEEKLY SIGNAL** --- 주차별 TV·온라인 반응 변화
-   **COMMENT SIGNAL** --- 댓글 주요 키워드 및 감성 비율

이를 통해 서로 다른 지표 사이의 차이와 변화에서 콘텐츠의 새로운 신호를
탐색합니다.

------------------------------------------------------------------------

## 02. Data & EDA

### 데이터 출처

방송콘텐츠 가치정보분석시스템 **RACOI** 데이터를 활용했습니다.

-   프로그램별 TV 시청률
-   연령별 / 성별 시청률
-   게시글 수 · 댓글 수 · 동영상 조회 수 · 뉴스 수
-   주차별 반응 데이터
-   댓글 키워드 및 감성 분석 결과

### EDA에서 발견한 특징

#### 1. TV와 DIGITAL은 항상 같은 흐름으로 움직이지 않았습니다.

주차별 데이터를 비교한 결과 TV 시청률과 온라인 반응의 상승·하락 및 최고
시점이 서로 다른 사례가 존재했습니다.

#### 2. 낮은 TV 시청률과 높은 DIGITAL 반응이 함께 나타나는 사례가 존재했습니다.

따라서 단일 지표가 아닌 여러 신호를 함께 비교할 수 있도록 서비스 분석
구조를 설계했습니다.

```{=html}
<!-- 추후 EDA 대표 이미지: ![EDA](docs/images/eda.png) -->
```

------------------------------------------------------------------------

## 03. CONTENT SIGNAL

### 기존 프로그램의 여러 신호를 한 화면에서 분석

프로그램을 검색하면 **TV · TARGET · DIGITAL** 데이터를 하나의 화면에서
비교하고, 전체 프로그램 내 상대적 위치와 시간에 따른 변화까지 확인할 수
있습니다.

### 주요 기능

-   프로그램 검색 및 분석
-   TV / DIGITAL / TARGET Signal 비교
-   전체 프로그램 내 상대적 위치 분석
-   TV vs DIGITAL 주차별 흐름 비교
-   동영상 조회 · 댓글 · 게시글 변화 확인
-   댓글 주요 키워드 및 감성 비율 확인

### DEMO PROGRAM

  프로그램                               주요 확인 기능
  -------------------------------------- ------------------------
  **김부장**                             TV + DIGITAL 종합 분석
  **신입사원 강회장**                    WEEKLY SIGNAL
  **스트릿 월드 파이터 : 디렉터스 워**   DIGITAL SIGNAL
  **유 퀴즈 온 더 블럭**                 COMMENT SIGNAL

> 전체 프로그램 검색이 가능하며, 위 프로그램은 주차별 반응 및 댓글
> 분석까지 포함된 상세 DEMO를 제공합니다.

### Service Preview

```{=html}
<!-- 추후 대표 이미지: ![CONTENT SIGNAL](docs/images/content-signal.png) -->
```
**DEMO VIDEO** --- 추후 CONTENT SIGNAL 시연 영상 링크 추가

------------------------------------------------------------------------

## 04. CREATIVE SIGNAL

### 분석에서 콘텐츠 기획 인사이트로 확장

CONTENT SIGNAL에서 분석한 프로그램 데이터를 CREATIVE SIGNAL로 전달하여
콘텐츠 기획 관점에서 다시 활용합니다.

### 주요 기능

-   프로그램 직접 검색
-   DIGITAL / YOUNG / HIDDEN 기준 콘텐츠 탐색
-   기존 분석 결과 연결
-   댓글 키워드 및 감성 데이터 활용
-   주차별 반응 데이터 활용
-   AI 기반 콘텐츠 기획 아이디어 생성

### AI 활용 방식

AI가 새로운 사실을 분석하거나 콘텐츠의 성공을 예측하도록 하지 않고,
**기존 데이터 분석 결과를 바탕으로 검토 가능한 콘텐츠 기획 아이디어를
생성하는 보조 도구**로 활용했습니다.

```{=html}
<!-- 추후 대표 이미지: ![CREATIVE SIGNAL](docs/images/creative-signal.png) -->
```
**DEMO VIDEO** --- 추후 CREATIVE SIGNAL 시연 영상 링크 추가

------------------------------------------------------------------------

## 05. BUSINESS SIGNAL

### 콘텐츠 분석을 광고·협찬 검토 관점으로 확장

BUSINESS SIGNAL은 두 가지 방향으로 콘텐츠와 비즈니스 데이터를
연결합니다.

#### CONTENT → BUSINESS

분석한 프로그램의 타깃 및 디지털 반응을 기반으로 광고·협찬 관점에서 검토
가능한 카테고리와 근거를 확인합니다.

#### ADVERTISER → CONTENT

광고주가 원하는 업종, 연령, 성별, 캠페인 목적, 중요 지표를 설정하면 해당
조건을 데이터 분석 기준으로 변환하여 프로그램 후보를 탐색합니다.

연령 · 성별 · DIGITAL · TV 지표를 전체 프로그램 내 상대적 위치로 변환한
뒤, 선택 조건의 중요도를 반영하여 후보 프로그램을 비교합니다.

> 후보 지수는 광고 효과나 수익을 예측하는 값이 아니라, 프로그램 탐색을
> 위한 서비스 내부 비교 기준입니다.

```{=html}
<!-- 추후 대표 이미지: ![BUSINESS SIGNAL](docs/images/business-signal.png) -->
```
**DEMO VIDEO** --- 추후 BUSINESS SIGNAL 시연 영상 링크 추가

------------------------------------------------------------------------

## 06. System Flow

``` text
RACOI / Excel
      ↓
Python · pandas
      ↓
Data Analysis
      ↓
FastAPI
      ↓
JSON API
      ↓
React · Axios
      ↓
Recharts Visualization
      ↓
CONTENT SIGNAL
   ↙         ↘
CREATIVE   BUSINESS
      ↓
    AI API
```

------------------------------------------------------------------------

## 07. Tech Stack

  Area                Technology
  ------------------- -----------------------------------------
  **Data Analysis**   Python, pandas, Excel, Jupyter Notebook
  **Backend**         FastAPI, Uvicorn
  **Frontend**        React, Vite, Axios, Recharts
  **AI**              OpenAI API

------------------------------------------------------------------------

## 08. Project Structure

``` text
content-signal/
├── analysis/
│   └── 01_data_check.ipynb
├── backend/
│   ├── analysis.py
│   └── main.py
├── data/
│   └── raw/
├── frontend/
│   └── React/
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

## 09. How to Run

### Backend

``` bash
pip install fastapi uvicorn pandas openpyxl python-dotenv openai
python -m uvicorn backend.main:app --reload
```

-   FastAPI: `http://127.0.0.1:8000`
-   Swagger: `http://127.0.0.1:8000/docs`

### Frontend

``` bash
cd frontend/React
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

### AI API 설정

AI Insight 기능은 OpenAI API를 사용합니다. 보안을 위해 실제 API Key는
GitHub 저장소에 포함하지 않았습니다.

프로젝트 루트에 `.env` 파일을 생성합니다.

``` env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

> API Key가 없어도 기본 데이터 분석 화면은 확인할 수 있으며, AI API를
> 호출하는 기능에는 별도의 API Key가 필요합니다.

------------------------------------------------------------------------

## 10. Future Development

현재 방송 프로그램 중심의 분석 구조를 향후 OTT 콘텐츠 데이터까지
확장하여, 플랫폼에 따라 달라지는 콘텐츠 소비와 반응 신호를 함께 분석할
수 있도록 발전시키고자 합니다.

------------------------------------------------------------------------

## CONTENT SIGNAL

**콘텐츠의 가치는 하나의 숫자로 설명되지 않습니다.**

시청률 · 타깃 · 온라인 반응 데이터를 함께 분석해 콘텐츠에 숨어 있는
다양한 신호를 발견합니다.

**DATA ANALYSIS → CONTENT PLANNING → BUSINESS REVIEW**
