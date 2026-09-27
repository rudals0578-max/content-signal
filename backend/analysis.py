import pandas as pd
from pathlib import Path


# 프로젝트 최상위 폴더
BASE_DIR = Path(__file__).resolve().parent.parent

# 종합반응DB 파일 경로
DATA_PATH = (
    BASE_DIR
    / "data"
    / "raw"
    / "종합반응DB_2026년06월_2026년08월.xlsx"
)


# ==================================================
# 프로그램 목록
# ==================================================

def load_programs():

    df = pd.read_excel(
        DATA_PATH,
        header=[5, 6, 7]
    )

    programs = df.iloc[:, [0, 1, 2, 3]].copy()

    programs.columns = [
        "month",
        "program",
        "channel",
        "day"
    ]

    # 문자열 정리
    programs["program"] = (
        programs["program"]
        .astype(str)
        .str.strip()
    )

    programs["channel"] = (
        programs["channel"]
        .astype(str)
        .str.strip()
    )

    programs = programs.drop_duplicates(
        subset=["program", "channel"]
    )

    return programs.to_dict(
        orient="records"
    )


# ==================================================
# 프로그램 상세 분석
# ==================================================

def get_program_detail(program_name):

    df = pd.read_excel(
        DATA_PATH,
        header=[5, 6, 7]
    )

    detail = df.iloc[:, [
        0,   # 월
        1,   # 프로그램명
        2,   # 채널
        4,   # 게시글
        5,   # 댓글
        6,   # 동영상조회
        18,  # 가구시청률
        20,  # 남성
        21,  # 여성
        22,  # 10대
        23,  # 20대
        24,  # 30대
        25,  # 40대
        26   # 50대
    ]].copy()

    detail.columns = [
        "month",
        "program",
        "channel",
        "posts",
        "comments",
        "video_views",
        "household_rating",
        "male_rating",
        "female_rating",
        "age10_rating",
        "age20_rating",
        "age30_rating",
        "age40_rating",
        "age50_rating"
    ]

    # 문자열 정리
    detail["program"] = (
        detail["program"]
        .astype(str)
        .str.strip()
    )

    detail["channel"] = (
        detail["channel"]
        .astype(str)
        .str.strip()
    )

    program_name = program_name.strip()

    # 숫자형 변환
    numeric_columns = [
        "posts",
        "comments",
        "video_views",
        "household_rating",
        "male_rating",
        "female_rating",
        "age10_rating",
        "age20_rating",
        "age30_rating",
        "age40_rating",
        "age50_rating"
    ]

    for column in numeric_columns:
        detail[column] = pd.to_numeric(
            detail[column],
            errors="coerce"
        )

    # 프로그램 검색
    selected = detail[
        detail["program"] == program_name
    ].copy()

    if selected.empty:
        return None

    # 여러 달 데이터 평균
    result = {
        "program": program_name,

        "channel":
            selected["channel"].iloc[0],

        "household_rating":
            selected["household_rating"].mean(),

        "male_rating":
            selected["male_rating"].mean(),

        "female_rating":
            selected["female_rating"].mean(),

        "age10_rating":
            selected["age10_rating"].mean(),

        "age20_rating":
            selected["age20_rating"].mean(),

        "age30_rating":
            selected["age30_rating"].mean(),

        "age40_rating":
            selected["age40_rating"].mean(),

        "age50_rating":
            selected["age50_rating"].mean(),

        "posts":
            selected["posts"].mean(),

        "comments":
            selected["comments"].mean(),

        "video_views":
            selected["video_views"].mean()
    }

    # ★ 이게 기존 코드에서 빠져 있었음
    return result


# ==================================================
# 전체 콘텐츠 대비 상대적 위치 분석
# ==================================================
def get_program_signal(program_name):

    df = pd.read_excel(
        DATA_PATH,
        header=[5, 6, 7]
    )

    analysis_df = df.iloc[:, [
        1,   # 프로그램명
        2,   # 채널
        5,   # 댓글
        6,   # 동영상조회
        18,  # 가구시청률
        20,  # 남성
        21,  # 여성
        22,  # 10대
        23,  # 20대
        24,  # 30대
        25,  # 40대
        26   # 50대
    ]].copy()

    analysis_df.columns = [
        "program",
        "channel",
        "comments",
        "video_views",
        "household_rating",
        "male_rating",
        "female_rating",
        "age10_rating",
        "age20_rating",
        "age30_rating",
        "age40_rating",
        "age50_rating"
    ]

    # 문자열 정리
    analysis_df["program"] = (
        analysis_df["program"]
        .astype(str)
        .str.strip()
    )

    analysis_df["channel"] = (
        analysis_df["channel"]
        .astype(str)
        .str.strip()
    )

    program_name = program_name.strip()

    # 숫자형 변환
    numeric_columns = [
        "comments",
        "video_views",
        "household_rating",
        "male_rating",
        "female_rating",
        "age10_rating",
        "age20_rating",
        "age30_rating",
        "age40_rating",
        "age50_rating"
    ]

    for column in numeric_columns:
        analysis_df[column] = pd.to_numeric(
            analysis_df[column],
            errors="coerce"
        )

    # 프로그램별 평균
    program_df = (
        analysis_df
        .groupby(
            ["program", "channel"],
            as_index=False
        )
        .mean(numeric_only=True)
    )

    # 선택 프로그램 찾기
    selected = program_df[
        program_df["program"] == program_name
    ]

    if selected.empty:
        return None

    selected = selected.iloc[0]

    # ------------------------------
    # 전체 프로그램 대비 상위 %
    # ------------------------------

    def top_percent(column):

        value = selected[column]

        if pd.isna(value):
            return None

        valid_data = program_df[
            program_df[column].notna()
        ]

        total = len(valid_data)

        if total == 0:
            return None

        higher_count = (
            valid_data[column] > value
        ).sum()

        rank = higher_count + 1

        percent = (
            rank / total
        ) * 100

        return round(percent, 1)

    # ------------------------------
    # 주요 연령 타깃 자동 탐색
    # ------------------------------

    age_columns = {
        "10대": "age10_rating",
        "20대": "age20_rating",
        "30대": "age30_rating",
        "40대": "age40_rating",
        "50대": "age50_rating"
    }

    valid_age_columns = {
        label: column
        for label, column in age_columns.items()
        if not pd.isna(selected[column])
    }

    if valid_age_columns:

        main_target = max(
            valid_age_columns,
            key=lambda label:
                selected[valid_age_columns[label]]
        )

        main_target_column = (
            valid_age_columns[main_target]
        )

        main_target_rating = round(
            float(
                selected[main_target_column]
            ),
            2
        )

        main_target_top_percent = (
            top_percent(main_target_column)
        )

    else:
        main_target = None
        main_target_rating = None
        main_target_top_percent = None

    # ------------------------------
    # API 결과
    # ------------------------------

    result = {
        "program":
            program_name,

        "channel":
            selected["channel"],

        "household_rating":
            round(
                float(
                    selected["household_rating"]
                ),
                2
            ),

        "video_views":
            round(
                float(
                    selected["video_views"]
                )
            ),

        "comments":
            round(
                float(
                    selected["comments"]
                )
            ),

        # 주요 타깃
        "main_target":
            main_target,

        "main_target_rating":
            main_target_rating,

        "main_target_top_percent":
            main_target_top_percent,

        # 상대적 위치
        "household_top_percent":
            top_percent(
                "household_rating"
            ),

        "video_top_percent":
            top_percent(
                "video_views"
            ),

        "comments_top_percent":
            top_percent(
                "comments"
            )
    }

    return result

def get_creative_signals():

    df = pd.read_excel(
        DATA_PATH,
        header=[5, 6, 7]
    )

    creative_df = df.iloc[:, [
        1,   # 프로그램명
        2,   # 채널
        5,   # 댓글
        6,   # 동영상 조회
        18,  # 가구 시청률
        23,  # 20대
        24,  # 30대
    ]].copy()

    creative_df.columns = [
        "program",
        "channel",
        "comments",
        "video_views",
        "household_rating",
        "age20_rating",
        "age30_rating"
    ]

    # 문자열 정리
    creative_df["program"] = (
        creative_df["program"]
        .astype(str)
        .str.strip()
    )

    creative_df["channel"] = (
        creative_df["channel"]
        .astype(str)
        .str.strip()
    )

    # 숫자형 변환
    numeric_columns = [
        "comments",
        "video_views",
        "household_rating",
        "age20_rating",
        "age30_rating"
    ]

    for column in numeric_columns:
        creative_df[column] = pd.to_numeric(
            creative_df[column],
            errors="coerce"
        )

    # 프로그램별 월 평균
    program_df = (
        creative_df
        .groupby(
            ["program", "channel"],
            as_index=False
        )
        .mean(numeric_only=True)
    )

    # --------------------------------
    # 1. 디지털 반응 강세
    # --------------------------------

    digital = (
        program_df
        .dropna(subset=["video_views"])
        .sort_values(
            "video_views",
            ascending=False
        )
        .head(5)
    )

    # --------------------------------
    # 2. 20·30대 시청 반응 강세
    # --------------------------------

    program_df["young_rating"] = (
        program_df[
            ["age20_rating", "age30_rating"]
        ]
        .mean(axis=1)
    )

    young = (
        program_df
        .dropna(subset=["young_rating"])
        .sort_values(
            "young_rating",
            ascending=False
        )
        .head(5)
    )

    # --------------------------------
    # 3. 숨은 콘텐츠
    #
    # 가구 시청률은 중앙값 이하인데
    # 동영상 조회는 상위 25% 이상인 콘텐츠
    # --------------------------------

    household_median = (
        program_df["household_rating"]
        .median()
    )

    video_q75 = (
        program_df["video_views"]
        .quantile(0.75)
    )

    hidden = program_df[
        (
            program_df["household_rating"]
            <= household_median
        )
        &
        (
            program_df["video_views"]
            >= video_q75
        )
    ].copy()

    hidden = (
        hidden
        .sort_values(
            "video_views",
            ascending=False
        )
        .head(5)
    )

    # --------------------------------
    # JSON 변환 함수
    # --------------------------------

    def make_list(data):

        result = []

        for _, row in data.iterrows():

            result.append({
                "program":
                    row["program"],

                "channel":
                    row["channel"],

                "household_rating":
                    round(
                        float(
                            row["household_rating"]
                        ),
                        2
                    ),

                "video_views":
                    round(
                        float(
                            row["video_views"]
                        )
                    ),

                "comments":
                    round(
                        float(
                            row["comments"]
                        )
                    ),

                "age20_rating":
                    round(
                        float(
                            row["age20_rating"]
                        ),
                        2
                    ),

                "age30_rating":
                    round(
                        float(
                            row["age30_rating"]
                        ),
                        2
                    )
            })

        return result

    return {
        "digital": make_list(digital),
        "young": make_list(young),
        "hidden": make_list(hidden)
    }
def get_business_candidates(
    age="20대",
    gender="여성",
    purpose="브랜드 인지도",
    digital=True,
    target=True,
    rating=False,
):
    df = pd.read_excel(
        DATA_PATH,
        header=[5, 6, 7]
    )

    # =====================================
    # 1. 필요한 데이터
    # =====================================

    business_df = df.iloc[
        :,
        [
            1,   # 프로그램명
            2,   # 채널
            6,   # 동영상 조회
            18,  # 가구 시청률
            20,  # 남성 시청률
            21,  # 여성 시청률
            22,  # 10대 시청률
            23,  # 20대 시청률
            24,  # 30대 시청률
            25,  # 40대 시청률
            26,  # 50대 시청률
        ],
    ].copy()

    business_df.columns = [
        "program",
        "channel",
        "video_views",
        "household_rating",
        "male_rating",
        "female_rating",
        "age10_rating",
        "age20_rating",
        "age30_rating",
        "age40_rating",
        "age50_rating",
    ]

    business_df["program"] = (
        business_df["program"]
        .astype(str)
        .str.strip()
    )

    business_df["channel"] = (
        business_df["channel"]
        .astype(str)
        .str.strip()
    )

    numeric_columns = [
        "video_views",
        "household_rating",
        "male_rating",
        "female_rating",
        "age10_rating",
        "age20_rating",
        "age30_rating",
        "age40_rating",
        "age50_rating",
    ]

    for column in numeric_columns:
        business_df[column] = pd.to_numeric(
            business_df[column],
            errors="coerce",
        )

    # =====================================
    # 2. 프로그램별 평균
    # =====================================

    program_df = (
        business_df
        .groupby(
            ["program", "channel"],
            as_index=False,
        )[numeric_columns]
        .mean()
    )

    # =====================================
    # 3. 선택 연령 / 성별
    # =====================================

    age_column_map = {
        "10대": "age10_rating",
        "20대": "age20_rating",
        "30대": "age30_rating",
        "40대": "age40_rating",
        "50대": "age50_rating",
    }

    gender_column_map = {
        "남성": "male_rating",
        "여성": "female_rating",
    }

    age_column = age_column_map.get(
        age,
        "age20_rating",
    )

    gender_column = gender_column_map.get(
        gender,
        "female_rating",
    )

    # =====================================
    # 4. Percentile
    # =====================================

    program_df["age_percentile"] = (
        program_df[age_column]
        .rank(
            pct=True,
            method="average",
        )
        * 100
    )

    program_df["gender_percentile"] = (
        program_df[gender_column]
        .rank(
            pct=True,
            method="average",
        )
        * 100
    )

    program_df["digital_percentile"] = (
        program_df["video_views"]
        .rank(
            pct=True,
            method="average",
        )
        * 100
    )

    program_df["rating_percentile"] = (
        program_df["household_rating"]
        .rank(
            pct=True,
            method="average",
        )
        * 100
    )

    # =====================================
    # 5. 기본 가중치
    #
    # 이것은 광고효과 예측값이 아니라
    # 후보 탐색을 위한 서비스 규칙
    # =====================================

    weights = {
        "age": 0.0,
        "gender": 0.0,
        "digital": 0.0,
        "rating": 0.0,
    }

    # 사용자가 체크한 중요 지표
    if target:
        weights["age"] += 1.0
        weights["gender"] += 1.0

    if digital:
        weights["digital"] += 1.0

    if rating:
        weights["rating"] += 1.0

    # 아무것도 선택하지 않았을 경우
    if sum(weights.values()) == 0:
        weights["age"] = 1.0
        weights["gender"] = 1.0
        weights["digital"] = 1.0

    # =====================================
    # 6. 캠페인 목적에 따른 추가 중요도
    # =====================================

    if purpose == "브랜드 인지도":
        weights["digital"] += 0.8
        weights["rating"] += 0.4

    elif purpose == "타깃 도달":
        weights["age"] += 1.0
        weights["gender"] += 1.0

    elif purpose == "디지털 확산":
        weights["digital"] += 1.5

    elif purpose == "대중 도달":
        weights["rating"] += 1.5

    # =====================================
    # 7. 가중 후보 지수
    # =====================================

    total_weight = sum(weights.values())

    program_df["candidate_index"] = (
        (
            program_df["age_percentile"]
            * weights["age"]
        )
        +
        (
            program_df["gender_percentile"]
            * weights["gender"]
        )
        +
        (
            program_df["digital_percentile"]
            * weights["digital"]
        )
        +
        (
            program_df["rating_percentile"]
            * weights["rating"]
        )
    ) / total_weight

    program_df = program_df.dropna(
        subset=["candidate_index"]
    )

    # =====================================
    # 8. 후보 정렬
    # =====================================

    result_df = (
        program_df
        .sort_values(
            [
                "candidate_index",
                "age_percentile",
                "gender_percentile",
            ],
            ascending=[
                False,
                False,
                False,
            ],
        )
        .head(10)
    )

    # =====================================
    # 9. JSON 안전 변환
    # =====================================

    def safe_number(
        value,
        digits=2
    ):
        if pd.isna(value):
            return None

        return round(
            float(value),
            digits,
        )

    # =====================================
    # 10. 결과 생성
    # =====================================

    results = []

    for _, row in result_df.iterrows():

        results.append(
            {
                "program":
                    row["program"],

                "channel":
                    row["channel"],

                "selected_age":
                    age,

                "selected_gender":
                    gender,

                "age_rating":
                    safe_number(
                        row[age_column]
                    ),

                "gender_rating":
                    safe_number(
                        row[gender_column]
                    ),

                "video_views":
                    safe_number(
                        row["video_views"],
                        0,
                    ),

                "household_rating":
                    safe_number(
                        row[
                            "household_rating"
                        ]
                    ),

                "age_percentile":
                    safe_number(
                        row[
                            "age_percentile"
                        ],
                        1,
                    ),

                "gender_percentile":
                    safe_number(
                        row[
                            "gender_percentile"
                        ],
                        1,
                    ),

                "digital_percentile":
                    safe_number(
                        row[
                            "digital_percentile"
                        ],
                        1,
                    ),

                "rating_percentile":
                    safe_number(
                        row[
                            "rating_percentile"
                        ],
                        1,
                    ),

                "candidate_index":
                    safe_number(
                        row[
                            "candidate_index"
                        ],
                        1,
                    ),
            }
        )

    # =====================================
    # 11. 사용된 가중치도 반환
    # =====================================

    return {
        "conditions": {
            "age": age,
            "gender": gender,
            "purpose": purpose,
            "digital": digital,
            "target": target,
            "rating": rating,
        },

        "weights": {
            "age": round(
                weights["age"],
                2,
            ),
            "gender": round(
                weights["gender"],
                2,
            ),
            "digital": round(
                weights["digital"],
                2,
            ),
            "rating": round(
                weights["rating"],
                2,
            ),
        },

        "candidates": results,
    }

def get_program_weekly_detail(program_name):
    path = "data/raw/프로그램_상세분석.xlsx"

    df = pd.read_excel(
        path,
        sheet_name="주차별반응"
    )

    # 선택한 프로그램만 가져오기
    program_df = df[
        df["프로그램명"].astype(str).str.strip()
        == program_name.strip()
    ].copy()

    if program_df.empty:
        return []

    program_df = program_df.fillna(0)

    result = []

    for _, row in program_df.iterrows():
        result.append({
            "week": str(row["주차"]),
            "household_rating": float(row["가구시청률(%)"]),
            "rating_2049": float(row["2049시청률(%)"]),
            "news": int(row["뉴스기사수"]),
            "posts": int(row["게시글수"]),
            "comments": int(row["댓글수"]),
            "video_views": int(row["동영상조회수"]),
        })

    return result

# =========================================================
# 프로그램 댓글 반응 분석
# =========================================================
def get_program_comment_analysis(program_name):
    path = "data/raw/프로그램_상세분석.xlsx"

    # =========================
    # 댓글 키워드
    # =========================
    keyword_df = pd.read_excel(
        path,
        sheet_name="댓글키워드"
    )

    keyword_df["프로그램명"] = (
        keyword_df["프로그램명"]
        .astype(str)
        .str.strip()
    )

    program_keywords = keyword_df[
        keyword_df["프로그램명"] == program_name.strip()
    ].copy()

    # 언급량 숫자 변환
    program_keywords["언급량"] = pd.to_numeric(
        program_keywords["언급량"],
        errors="coerce"
    ).fillna(0)

    # 언급량 높은 순
    program_keywords = program_keywords.sort_values(
        "언급량",
        ascending=False
    )

    keywords = []

    for _, row in program_keywords.iterrows():
        keywords.append({
            "keyword": str(row["키워드"]),
            "count": int(row["언급량"])
        })

    # =========================
    # 댓글 감성
    # =========================
    sentiment_df = pd.read_excel(
        path,
        sheet_name="댓글감성"
    )

    sentiment_df["프로그램명"] = (
        sentiment_df["프로그램명"]
        .astype(str)
        .str.strip()
    )

    program_sentiment = sentiment_df[
        sentiment_df["프로그램명"] == program_name.strip()
    ]

    sentiment = None
    sentiment_week = None

    if not program_sentiment.empty:
        row = program_sentiment.iloc[0]

        sentiment = {
            "positive": float(row["긍정비율(%)"]),
            "negative": float(row["부정비율(%)"])
        }

        sentiment_week = str(row["기준주차"])

    # =========================
    # 키워드 기준 주차
    # =========================
    keyword_week = None

    if not program_keywords.empty:
        keyword_week = str(
            program_keywords.iloc[0]["기준주차"]
        )

    # =========================
    # 최종 결과
    # =========================
    return {
        "program": program_name,
        "week": sentiment_week or keyword_week,
        "keywords": keywords,
        "sentiment": sentiment
    }