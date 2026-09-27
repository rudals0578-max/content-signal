from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.analysis import (
    load_programs,
    get_program_detail,
    get_program_signal,
    get_creative_signals,
    get_business_candidates,
    get_program_weekly_detail,
    get_program_comment_analysis
)

import os
import json

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
from typing import List, Optional

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# =========================================================
# AI CREATIVE INSIGHT REQUEST
# =========================================================

class KeywordItem(BaseModel):
    keyword: str
    count: int


class WeeklyItem(BaseModel):
    week: str
    household_rating: float = 0
    rating_2049: float = 0
    news: int = 0
    posts: int = 0
    comments: int = 0
    video_views: int = 0

# =========================================================
# AI BUSINESS INSIGHT REQUEST
# =========================================================

class BusinessInsightRequest(BaseModel):
    program: str

    channel: Optional[str] = None

    industry: Optional[str] = None
    purpose: Optional[str] = None

    main_target: Optional[str] = None

    male_rating: float = 0
    female_rating: float = 0

    household_rating: float = 0

    video_views: float = 0
    comments: float = 0
    posts: float = 0

    keywords: List[KeywordItem] = []

    positive: float = 0
    negative: float = 0

class CreativeInsightRequest(BaseModel):
    program: str

    channel: Optional[str] = None

    keywords: List[KeywordItem]

    positive: float
    negative: float

    main_target: Optional[str] = None

    weekly: List[WeeklyItem] = []

app = FastAPI(
    title="CONTENT SIGNAL API",
    description="방송 콘텐츠 데이터 분석 API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "CONTENT SIGNAL API",
        "status": "running"
    }


@app.get("/programs")
def get_programs():
    return load_programs()


@app.get("/programs/{program_name}")
def program_detail(program_name: str):

    result = get_program_detail(program_name)

    if result is None:
        return {
            "error": "프로그램을 찾을 수 없습니다."
        }

    return result

@app.get("/analysis/{program_name}")
def program_signal(program_name: str):

    result = get_program_signal(program_name)

    if result is None:
        return {
            "error": "프로그램을 찾을 수 없습니다."
        }

    return result

@app.get("/creative")
def creative_signals():

    return get_creative_signals()

@app.get("/business/candidates")
def business_candidates(
    age: str = "20대",
    gender: str = "여성",
    purpose: str = "브랜드 인지도",
    digital: bool = True,
    target: bool = True,
    rating: bool = False,
):
    return get_business_candidates(
        age=age,
        gender=gender,
        purpose=purpose,
        digital=digital,
        target=target,
        rating=rating,
    )

@app.get("/programs/{program_name}/weekly")
def program_weekly_detail(program_name: str):
    return {
        "program": program_name,
        "weekly": get_program_weekly_detail(program_name)
    }

# =========================================================
# 프로그램 댓글 반응 분석
# =========================================================
@app.get("/programs/{program_name}/comments")
def program_comment_analysis(program_name: str):
    return get_program_comment_analysis(program_name)

# =========================================================
# AI CREATIVE INSIGHT
# =========================================================

@app.post("/creative/ai-insight")
def create_ai_creative_insight(
    data: CreativeInsightRequest
):
    # API KEY 확인
    if not os.getenv("OPENAI_API_KEY"):
        return {
            "error": "OPENAI_API_KEY가 설정되지 않았습니다."
        }

    # -----------------------------------------
    # AI에게 전달할 실제 데이터
    # -----------------------------------------

    keyword_text = "\n".join(
        [
            f"- {item.keyword}: {item.count}회"
            for item in data.keywords
        ]
    )

    weekly_text = "\n".join(
        [
            (
                f"- {item.week}: "
                f"가구시청률 {item.household_rating}%, "
                f"2049시청률 {item.rating_2049}%, "
                f"댓글 {item.comments:,}건, "
                f"게시글 {item.posts:,}건, "
                f"동영상조회 {item.video_views:,}회, "
                f"뉴스 {item.news:,}건"
            )
            for item in data.weekly
        ]
    )

    prompt = f"""
당신은 방송 콘텐츠 기획을 지원하는 데이터 분석 어시스턴트입니다.

아래 데이터에서 실제로 관찰되는 신호만 근거로
후속 콘텐츠 기획 아이디어를 제안하세요.

프로그램:
{data.program}

채널:
{data.channel or "정보 없음"}

데이터상 주요 시청 연령층:
{data.main_target or "정보 없음"}

댓글 감성:
긍정 {data.positive}%
부정 {data.negative}%

댓글 주요 키워드:
{keyword_text}

주차별 반응:
{weekly_text}


[중요 규칙]

1. 데이터에 없는 사실을 만들어내지 마세요.
2. 키워드만으로 시청자의 의도나 선호를 단정하지 마세요.
3. 콘텐츠의 성공 가능성, 시청률 상승,
   광고 효과를 예측하지 마세요.
4. 관찰된 데이터와 해석을 명확히 구분하세요.
5. 아이디어마다 어떤 데이터가 근거가 되었는지
   구체적으로 설명하세요.
6. 방송/디지털 콘텐츠 제작자가 검토할 수 있는
   구체적인 콘텐츠 아이템을 제안하세요.

다음 JSON 형식으로만 답하세요.

{{
  "summary": "전체 반응을 한 문장으로 요약",
  "observed_signals": [
    "관찰된 신호 1",
    "관찰된 신호 2",
    "관찰된 신호 3"
  ],
  "ideas": [
    {{
      "category": "영문 카테고리",
      "title": "콘텐츠 아이템 제목",
      "description": "어떤 콘텐츠인지 설명",
      "rationale": "왜 검토할 수 있는 아이디어인지 설명",
      "evidence": [
        "실제 데이터 근거",
        "실제 데이터 근거"
      ]
    }}
  ],
  "note": "이 결과는 실제 반응 데이터를 기반으로 생성된 기획 검토용 아이디어이며 성과를 예측하지 않습니다."
}}

ideas는 3개만 생성하세요.
"""

    try:
        response = client.responses.create(
            model="gpt-5.6-luna",
            input=prompt,
        )

        result_text = response.output_text

        # 혹시 ```json 코드블록이 붙는 경우 제거
        cleaned_text = (
            result_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        result = json.loads(cleaned_text)

        return {
            "program": data.program,
            "ai_insight": result
        }

    except json.JSONDecodeError:
        return {
            "error": "AI 응답을 JSON으로 변환하지 못했습니다."
        }

    except Exception as e:
        print("AI Insight Error:", e)

        return {
            "error": "AI 기획 인사이트 생성 중 오류가 발생했습니다."
        }

    # =========================================================
# AI BUSINESS MATCH
# =========================================================

@app.post("/business/ai-match")
def create_ai_business_match(
    data: BusinessInsightRequest
):

    if not os.getenv("OPENAI_API_KEY"):
        return {
            "error": "OPENAI_API_KEY가 설정되지 않았습니다."
        }

    # -----------------------------------------
    # 키워드 정리
    # -----------------------------------------

    if data.keywords:
        keyword_text = "\n".join(
            [
                f"- {item.keyword}: {item.count}회"
                for item in data.keywords
            ]
        )
    else:
        keyword_text = "댓글 키워드 데이터 없음"

    prompt = f"""
당신은 방송 콘텐츠의 광고·협찬 검토를 지원하는
데이터 분석 어시스턴트입니다.

아래는 실제 방송 콘텐츠 반응 데이터입니다.

이 데이터를 바탕으로 해당 콘텐츠에서
광고 또는 협찬 대상으로 검토해볼 수 있는
'상품/서비스 카테고리'를 제안하세요.


[프로그램]

프로그램명:
{data.program}

채널:
{data.channel or "정보 없음"}


[캠페인 검토 조건]

사용자가 선택한 업종:
{data.industry or "지정 없음"}

캠페인 목적:
{data.purpose or "지정 없음"}


[시청자 데이터]

데이터상 주요 시청 연령층:
{data.main_target or "정보 없음"}

남성 시청률:
{data.male_rating}%

여성 시청률:
{data.female_rating}%

가구 시청률:
{data.household_rating}%


[디지털 반응]

동영상 조회:
{data.video_views:,.0f}회

댓글:
{data.comments:,.0f}건

게시글:
{data.posts:,.0f}건


[댓글 감성]

긍정:
{data.positive}%

부정:
{data.negative}%


[댓글 주요 키워드]

{keyword_text}


[중요 규칙]

1. 특정 브랜드를 추천하지 마세요.

2. 상품 또는 서비스의 일반적인
   광고·협찬 카테고리만 제안하세요.

3. 실제 광고 효과, 매출 상승,
   구매 전환을 예측하지 마세요.

4. 데이터만으로 시청자의 구매 의도나
   상품 선호를 단정하지 마세요.

5. 댓글 키워드와 시청자 데이터의 의미를
   과도하게 해석하지 마세요.

6. 각 카테고리를 왜 검토할 수 있는지
   반드시 입력 데이터에 근거하여 설명하세요.

7. 사용자가 선택한 업종이 있다면
   참고 조건으로 활용하되,
   데이터가 이를 직접 증명한다고 표현하지 마세요.

8. 결과는 광고주 확정이나 광고 효과 예측이 아니라
   광고·협찬 기획 단계에서 검토할 수 있는
   후보군 탐색을 위한 것입니다.


다음 JSON 형식으로만 답하세요.

{{
  "summary": "비즈니스 관점의 전체 데이터 특징 요약",

  "observed_signals": [
    "실제 데이터에서 관찰된 신호 1",
    "실제 데이터에서 관찰된 신호 2",
    "실제 데이터에서 관찰된 신호 3"
  ],

  "categories": [
    {{
      "category": "광고·협찬 검토 카테고리",
      "match_point": "이 카테고리를 검토할 수 있는 이유",
      "activation_idea": "방송 또는 디지털 콘텐츠 안에서 검토할 수 있는 활용 방식",
      "evidence": [
        "실제 데이터 근거 1",
        "실제 데이터 근거 2"
      ]
    }}
  ],

  "note": "본 결과는 실제 콘텐츠 반응 데이터를 기반으로 생성된 광고·협찬 검토용 아이디어이며 광고 효과나 매출을 예측하지 않습니다."
}}

categories는 3개만 생성하세요.
"""

    try:

        response = client.responses.create(
            model="gpt-5.6-luna",
            input=prompt,
        )

        result_text = response.output_text

        cleaned_text = (
            result_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        result = json.loads(cleaned_text)

        return {
            "program": data.program,
            "business_insight": result
        }

    except json.JSONDecodeError:

        return {
            "error":
                "AI 응답을 JSON으로 변환하지 못했습니다."
        }

    except Exception as e:

        print(
            "Business AI Error:",
            e
        )

        return {
            "error":
                "AI 비즈니스 인사이트 생성 중 오류가 발생했습니다."
        }