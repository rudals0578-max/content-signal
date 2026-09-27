import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import { getProgramImage } from "../data/programImages";

import "../styles/Creative.css";

function Creative() {
  const location = useLocation();
  const navigate = useNavigate();

  const [insightData, setInsightData] = useState(
    location.state?.program ? location.state : null,
  );

  // ========================================
  // 페이지 진입 시 맨 위로 이동
  // ========================================
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  // ========================================
  // DIRECT PROGRAM SEARCH
  // ========================================

  const [programs, setPrograms] = useState([]);
  const [programSearch, setProgramSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // ========================================
  // CREATIVE STATE
  // ========================================
  const [creativeData, setCreativeData] = useState({
    digital: [],
    young: [],
    hidden: [],
  });

  const [activeTab, setActiveTab] = useState("digital");
  const [loading, setLoading] = useState(true);

  // ========================================
  // AI STATE
  // ========================================
  const currentProgram = insightData?.program || null;

  const aiCacheKey = currentProgram
    ? `contentSignalAiInsight_${currentProgram}`
    : null;

  const [aiInsight, setAiInsight] = useState(() => {
    if (!aiCacheKey) {
      return null;
    }

    const savedInsight = sessionStorage.getItem(aiCacheKey);

    if (!savedInsight) {
      return null;
    }

    try {
      return JSON.parse(savedInsight);
    } catch (error) {
      console.error("저장된 AI 결과를 불러오지 못했습니다.", error);
      return null;
    }
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // ========================================
  // CREATIVE 데이터 가져오기
  // ========================================
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/creative")
      .then((response) => {
        setCreativeData(response.data);
      })
      .catch((error) => {
        console.error("Creative 데이터 불러오기 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ========================================
  // 검색용 프로그램 목록
  // ========================================

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/programs")
      .then((response) => {
        setPrograms(response.data || []);
      })
      .catch((error) => {
        console.error("프로그램 목록 불러오기 실패:", error);
      });
  }, []);

  // ========================================
  // TAB 정보
  // ========================================
  const tabInfo = {
    digital: {
      number: "01",
      label: "DIGITAL SIGNAL",
      titlePrefix: "디지털 반응",
      titleSuffix: "이 강한 콘텐츠",
      description:
        "동영상 조회 데이터를 기준으로 온라인에서 높은 반응을 보인 콘텐츠를 확인합니다.",
    },

    young: {
      number: "02",
      label: "YOUNG TARGET",
      titlePrefix: "20·30대 반응",
      titleSuffix: "이 강한 콘텐츠",
      description:
        "20대와 30대 시청률을 함께 비교해 젊은 시청층에서 상대적으로 높은 반응을 보인 콘텐츠를 확인합니다.",
    },

    hidden: {
      number: "03",
      label: "HIDDEN SIGNAL",
      titlePrefix: "숨은 콘텐츠",
      titleSuffix: " 신호를 발견하다",
      description:
        "가구 시청률만으로는 눈에 띄기 어렵지만 디지털 반응에서 특징이 나타난 콘텐츠를 살펴봅니다.",
    },
  };

  const currentInfo = tabInfo[activeTab];
  const currentData = creativeData[activeTab] || [];

  // ========================================
  // 최대 동영상 조회수
  // ========================================
  const maxVideoViews =
    currentData.length > 0
      ? Math.max(...currentData.map((item) => Number(item.video_views || 0)))
      : 0;

  // ========================================
  // 숫자 표시
  // ========================================
  const formatNumber = (number) => {
    const value = Number(number || 0);

    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)}천만`;
    }

    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}만`;
    }

    return Math.round(value).toLocaleString();
  };

  // ========================================
  // 카드 핵심 지표
  // ========================================
  const getMainMetric = (item) => {
    if (activeTab === "young") {
      const youngRating =
        (Number(item.age20_rating || 0) + Number(item.age30_rating || 0)) / 2;

      return {
        label: "20·30대 평균 시청률",
        value: `${youngRating.toFixed(2)}%`,
      };
    }

    return {
      label: "동영상 조회",
      value: formatNumber(item.video_views),
    };
  };

  // ========================================
  // Analysis → Creative 전달 데이터
  // ========================================

  // 프로그램 정보가 넘어오면 AI 영역 표시
  const hasInsightData = Boolean(insightData?.program);

  const filteredPrograms = programSearch.trim()
    ? programs
        .filter((item) => {
          const programName = typeof item === "string" ? item : item.program;

          return programName
            ?.toLowerCase()
            .includes(programSearch.trim().toLowerCase());
        })
        .slice(0, 8)
    : [];

  const topKeywords = insightData?.keywords?.slice(0, 6) || [];

  const positive = insightData?.sentiment?.positive ?? 0;
  const negative = insightData?.sentiment?.negative ?? 0;

  // ========================================
  // 주차별 최고 반응 찾기
  // ========================================
  const getPeakWeek = (key) => {
    const weekly = insightData?.weekly || [];

    if (weekly.length === 0) {
      return null;
    }

    return weekly.reduce((maxItem, item) =>
      Number(item[key] || 0) > Number(maxItem[key] || 0) ? item : maxItem,
    );
  };

  const videoPeak = getPeakWeek("video_views");
  const commentPeak = getPeakWeek("comments");

  // ========================================
  // 프로그램별 AI 캐시 불러오기
  // ========================================
  useEffect(() => {
    if (!aiCacheKey) {
      setAiInsight(null);
      setAiError("");
      return;
    }

    const savedInsight = sessionStorage.getItem(aiCacheKey);

    if (savedInsight) {
      try {
        setAiInsight(JSON.parse(savedInsight));
      } catch (error) {
        console.error("AI 캐시 불러오기 실패:", error);
        setAiInsight(null);
      }
    } else {
      setAiInsight(null);
    }

    setAiError("");
  }, [aiCacheKey]);

  // ========================================
  // Creative에서 프로그램 직접 분석
  // ========================================

  const analyzeProgramDirectly = async (programName) => {
    if (!programName || searchLoading) return;

    setSearchLoading(true);
    setSearchError("");

    try {
      const [detailResponse, signalResponse, weeklyResponse, commentResponse] =
        await Promise.all([
          axios.get(
            `http://127.0.0.1:8000/programs/${encodeURIComponent(programName)}`,
          ),

          axios.get(
            `http://127.0.0.1:8000/analysis/${encodeURIComponent(programName)}`,
          ),

          axios.get(
            `http://127.0.0.1:8000/programs/${encodeURIComponent(programName)}/weekly`,
          ),

          axios.get(
            `http://127.0.0.1:8000/programs/${encodeURIComponent(programName)}/comments`,
          ),
        ]);

      const detail = detailResponse.data;
      const signalData = signalResponse.data;
      const weekly = weeklyResponse.data?.weekly || [];
      const comment = commentResponse.data || {};

      const newInsightData = {
        program: detail.program || programName,
        channel: detail.channel || null,

        keywords: comment.keywords || [],

        sentiment: {
          positive: Number(comment.sentiment?.positive || 0),
          negative: Number(comment.sentiment?.negative || 0),
        },

        weekly,

        target: {
          mainTarget: signalData.main_target || null,
          mainTargetRating: signalData.main_target_rating || null,
        },

        digital: {
          videoViews: detail.video_views || 0,
          comments: detail.comments || 0,
          posts: detail.posts || 0,
        },
      };

      setInsightData(newInsightData);

      setProgramSearch("");

      setTimeout(() => {
        document.getElementById("ai-creative-insight")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);
    } catch (error) {
      console.error("프로그램 직접 분석 실패:", error);

      setSearchError("프로그램 분석 데이터를 불러오지 못했습니다.");
    } finally {
      setSearchLoading(false);
    }
  };

  // ========================================
  // AI 기획 아이디어 생성
  // ========================================
  const generateAiInsight = async () => {
    if (!insightData?.program || aiLoading || aiInsight) {
      return;
    }

    setAiLoading(true);
    setAiError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/creative/ai-insight",
        {
          program: insightData.program,
          channel: insightData.channel || null,
          keywords: insightData.keywords || [],
          positive: Number(insightData.sentiment?.positive) || 0,
          negative: Number(insightData.sentiment?.negative) || 0,
          main_target: insightData.target?.mainTarget || null,
          weekly: insightData.weekly || [],
        },
      );

      if (response.data.error) {
        setAiError(response.data.error);
        return;
      }

      const result = response.data.ai_insight;

      setAiInsight(result);

      if (aiCacheKey) {
        sessionStorage.setItem(aiCacheKey, JSON.stringify(result));
      }
    } catch (error) {
      console.error("AI 기획 인사이트 생성 실패:", error);
      setAiError("AI 기획 인사이트를 생성하지 못했습니다.");
    } finally {
      setAiLoading(false);
    }
  };
  // ========================================
  // Business 페이지 이동
  // ========================================
  const goToBusiness = () => {
    if (!insightData?.program) return;

    navigate("/business", {
      state: {
        program: insightData.program,
        channel: insightData.channel,

        keywords: insightData.keywords,
        sentiment: insightData.sentiment,
        commentWeek: insightData.commentWeek,

        weekly: insightData.weekly,

        target: insightData.target,
        digital: insightData.digital,

        aiInsight: aiInsight,
      },
    });
  };

  return (
    <div className="creative-page">
      <Header />

      {/* ========================================
          HERO
      ======================================== */}
      <section className="creative-hero">
        <div className="creative-hero-inner">
          {/* LEFT */}
          <div className="creative-hero-content">
            <div className="creative-eyebrow">
              <span></span>
              CREATIVE SIGNAL
            </div>

            <h1>
              데이터에서
              <br />
              <strong>기획의 단서를 찾다</strong>
            </h1>

            <p>
              콘텐츠의 디지털 반응과 시청자 데이터를 비교해
              <br />
              다음 콘텐츠 기획에 참고할 수 있는 패턴을 탐색합니다.
            </p>

            <div className="creative-hero-tags">
              <span>DIGITAL</span>
              <span>TARGET</span>
              <span>DISCOVERY</span>
            </div>

            {/* 핵심 분석 기준 */}
            <div className="creative-principles">
              {/* 시청 성과 */}
              <div className="creative-principle-item">
                <div className="principle-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="4" width="18" height="13" rx="2" />
                    <path d="M8 21h8" />
                    <path d="M12 17v4" />
                  </svg>
                </div>

                <div className="principle-text">
                  <strong>시청 성과</strong>
                  <span>TV에서 나타난 시청 반응</span>
                </div>
              </div>

              <div className="creative-principle-divider"></div>

              {/* 타깃 반응 */}
              <div className="creative-principle-item">
                <div className="principle-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="9" cy="8" r="3" />
                    <circle cx="17" cy="9" r="2.5" />
                    <path d="M3.5 19c.5-4 2.6-6 5.5-6s5 2 5.5 6" />
                    <path d="M14 14c3.5-.5 5.8 1.2 6.5 5" />
                  </svg>
                </div>

                <div className="principle-text">
                  <strong>타깃 반응</strong>
                  <span>연령·성별에서 나타난 특징</span>
                </div>
              </div>

              <div className="creative-principle-divider"></div>

              {/* 디지털 확산 */}
              <div className="creative-principle-item">
                <div className="principle-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M5 19V12" />
                    <path d="M12 19V5" />
                    <path d="M19 19V9" />
                  </svg>
                </div>

                <div className="principle-text">
                  <strong>디지털 확산</strong>
                  <span>온라인에서 나타난 반응</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="creative-hero-visual">
            <div className="creative-visual-card visual-card-one">
              <div className="visual-card-head">
                <span>DIGITAL</span>
                <small>01</small>
              </div>

              <div className="visual-bars">
                <i style={{ height: "34%" }}></i>
                <i style={{ height: "52%" }}></i>
                <i style={{ height: "46%" }}></i>
                <i style={{ height: "76%" }}></i>
                <i style={{ height: "62%" }}></i>
                <i style={{ height: "90%" }}></i>
              </div>
            </div>

            <div className="creative-visual-card visual-card-two">
              <div>
                <span>TARGET</span>
                <strong>20 · 30</strong>
              </div>

              <div className="creative-circle">
                <div></div>
              </div>
            </div>

            <div className="creative-visual-card visual-card-three">
              <span>HIDDEN SIGNAL</span>
              <strong>DISCOVER</strong>

              <div className="discover-line">
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>

            <div className="creative-visual-center">
              <span>CREATIVE</span>
              <strong>SIGNAL</strong>
            </div>
          </div>
        </div>
      </section>
      {/* ========================================
    DIRECT PROGRAM SEARCH
======================================== */}

      <section className="creative-direct-search">
        <div className="creative-direct-search-inner">
          <div className="creative-search-heading">
            <div>
              <span>ANALYZE A PROGRAM</span>

              <h2>
                어떤 콘텐츠의
                <br />
                <strong>기획 신호를 살펴볼까요?</strong>
              </h2>
            </div>

            <p>
              프로그램을 검색하면 시청자 타깃과 디지털 반응, 댓글 데이터를
              불러와 AI 기획 인사이트로 연결합니다.
            </p>
          </div>

          <div className="creative-search-box">
            <input
              type="text"
              value={programSearch}
              onChange={(e) => setProgramSearch(e.target.value)}
              placeholder="프로그램명을 검색하세요."
            />

            <span>SEARCH</span>
          </div>

          {programSearch.trim() && (
            <div className="creative-search-results">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((item, index) => {
                  const programName =
                    typeof item === "string" ? item : item.program;

                  const channel = typeof item === "string" ? "" : item.channel;

                  return (
                    <button
                      key={`${programName}-${index}`}
                      onClick={() => analyzeProgramDirectly(programName)}
                      disabled={searchLoading}
                    >
                      <img
                        src={getProgramImage(programName)}
                        alt={`${programName} 포스터`}
                        onError={(e) => {
                          e.currentTarget.src = "/images/programs/default.jpg";
                        }}
                      />

                      <div>
                        <span>{channel || "PROGRAM"}</span>
                        <strong>{programName}</strong>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="creative-search-empty">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          )}

          {searchError && (
            <div className="creative-search-error">{searchError}</div>
          )}
        </div>
      </section>

      {/* ========================================
          AI CREATIVE INSIGHT
      ======================================== */}
      {hasInsightData && (
        <section className="ai-creative-section" id="ai-creative-insight">
          <div className="ai-creative-container">
            {/* HEADER */}
            <div className="ai-insight-header">
              <div>
                <span className="ai-section-label">AI CREATIVE INSIGHT</span>

                <h2>
                  반응 데이터에서
                  <br />
                  다음 콘텐츠의 단서를 찾다
                </h2>

                <p>
                  실제 시청자 반응 데이터를 기반으로 콘텐츠 기획에 활용할 수
                  있는 아이디어를 탐색합니다.
                </p>
              </div>
              <div className="ai-program-badge">
                <div className="ai-program-poster">
                  <img
                    src={getProgramImage(insightData.program)}
                    alt={`${insightData.program} 포스터`}
                    onError={(e) => {
                      e.currentTarget.src = "/images/programs/default.jpg";
                    }}
                  />
                </div>

                <div className="ai-program-info">
                  <span>ANALYZED PROGRAM</span>
                  <strong>{insightData.program}</strong>
                  <p>{insightData.channel || "CHANNEL"}</p>
                </div>
              </div>
            </div>

            {/* ========================================
                OBSERVED SIGNAL
            ======================================== */}
            <div className="observed-signal-card">
              <div className="observed-title">
                <div>
                  <span>01 · OBSERVED SIGNAL</span>
                  <h3>데이터에서 관찰된 반응</h3>
                </div>
              </div>

              {/* KEYWORDS */}
              <div className="observed-keywords">
                {topKeywords.length > 0 ? (
                  topKeywords.map((item) => (
                    <div className="observed-keyword" key={item.keyword}>
                      <strong>{item.keyword}</strong>
                      <span>{Number(item.count || 0).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="observed-keyword">
                    <strong>키워드 데이터 없음</strong>
                  </div>
                )}
              </div>

              {/* SUMMARY */}
              <div className="observed-summary">
                <div>
                  <span>POSITIVE</span>
                  <strong>{positive}%</strong>
                  <p>긍정 댓글 비율</p>
                </div>

                <div>
                  <span>NEGATIVE</span>
                  <strong>{negative}%</strong>
                  <p>부정 댓글 비율</p>
                </div>

                <div>
                  <span>MAIN AUDIENCE</span>
                  <strong>{insightData.target?.mainTarget || "-"}</strong>
                  <p>데이터상 주요 시청 연령층</p>
                </div>

                <div>
                  <span>VIDEO PEAK</span>

                  <strong>
                    {videoPeak
                      ? `${Number(videoPeak.video_views).toLocaleString()}회`
                      : "-"}
                  </strong>

                  <p>{videoPeak ? `${videoPeak.week} 최고 조회` : "-"}</p>
                </div>
              </div>
            </div>

            {/* ========================================
                OBSERVED DATA → AI → CONTENT IDEA
            ======================================== */}
            <div className="signal-to-ai">
              <span>OBSERVED DATA</span>
              <div className="signal-line"></div>

              <strong>AI</strong>

              <div className="signal-line"></div>
              <span>CONTENT IDEA</span>
            </div>

            {/* ========================================
                AI RESULT
            ======================================== */}
            <div className="ai-result-preview">
              <div className="ai-result-heading">
                <div>
                  <span>02 · AI CONTENT IDEAS</span>

                  <h3>
                    이 반응을 어떤 콘텐츠로
                    <br />
                    확장할 수 있을까?
                  </h3>
                </div>

                <div
                  className={
                    aiInsight
                      ? "ai-status complete"
                      : aiLoading
                        ? "ai-status loading"
                        : "ai-status"
                  }
                >
                  {aiInsight
                    ? "AI COMPLETE"
                    : aiLoading
                      ? "AI ANALYZING"
                      : "AI READY"}
                </div>
              </div>

              {/* ========================================
                  AI 실행 전
              ======================================== */}
              {!aiInsight && !aiLoading && (
                <div className="ai-generate-area">
                  <div className="ai-ready-box">
                    <div className="ai-ready-icon">AI</div>

                    <div>
                      <strong>분석 데이터가 준비되었습니다.</strong>

                      <p>
                        댓글 키워드, 감성 반응, 시청자 타깃과 디지털 반응을
                        기반으로 AI가 기획 아이디어를 제안합니다.
                      </p>
                    </div>
                  </div>

                  <div className="ai-evidence-preview">
                    <span>AI INPUT PREVIEW</span>

                    {topKeywords.length > 0 && (
                      <p>
                        <b>{insightData.program}</b>에서{" "}
                        {topKeywords.map((item) => item.keyword).join(" · ")}{" "}
                        등의 키워드가 주요 반응으로 나타났습니다.
                      </p>
                    )}

                    {commentPeak && (
                      <p>
                        댓글 반응은 <b>{commentPeak.week}</b>에{" "}
                        <b>
                          {Number(commentPeak.comments || 0).toLocaleString()}
                        </b>
                        건으로 가장 높았습니다.
                      </p>
                    )}

                    {videoPeak && (
                      <p>
                        동영상 조회는 <b>{videoPeak.week}</b>에{" "}
                        <b>
                          {Number(videoPeak.video_views || 0).toLocaleString()}
                        </b>
                        회로 가장 높았습니다.
                      </p>
                    )}
                  </div>

                  <button
                    className="ai-generate-button"
                    onClick={generateAiInsight}
                  >
                    <span>AI</span>
                    기획 아이디어 생성
                    <strong>→</strong>
                  </button>
                </div>
              )}

              {/* ========================================
                  AI 로딩
              ======================================== */}
              {aiLoading && (
                <div className="ai-loading-box">
                  <div className="ai-loading-circle">AI</div>

                  <div>
                    <strong>반응 데이터를 분석하고 있습니다.</strong>

                    <p>
                      관찰된 신호를 바탕으로 콘텐츠 아이디어를 생성하고
                      있습니다.
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================
                  ERROR
              ======================================== */}
              {aiError && !aiLoading && !aiInsight && (
                <div className="ai-error-box">
                  <strong>AI 분석 중 오류가 발생했습니다.</strong>

                  <p>{aiError}</p>

                  <button
                    onClick={() => {
                      setAiError("");
                      generateAiInsight();
                    }}
                  >
                    다시 시도
                  </button>
                </div>
              )}

              {/* ========================================
                  실제 AI 결과
              ======================================== */}
              {aiInsight && (
                <div className="ai-generated-result">
                  {/* AI SUMMARY */}
                  <div className="ai-summary-card">
                    <span>AI SUMMARY</span>
                    <p>{aiInsight.summary}</p>
                  </div>

                  {/* OBSERVED SIGNALS */}
                  {aiInsight.observed_signals?.length > 0 && (
                    <div className="ai-observed-result">
                      <span>OBSERVED SIGNALS</span>

                      <div>
                        {aiInsight.observed_signals.map((signalItem, index) => (
                          <p key={index}>
                            <strong>
                              {String(index + 1).padStart(2, "0")}
                            </strong>

                            {signalItem}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CONTENT IDEAS */}
                  <div className="ai-idea-list">
                    {aiInsight.ideas?.map((idea, index) => (
                      <article
                        className="ai-idea-card"
                        key={`${idea.title}-${index}`}
                      >
                        <div className="ai-idea-number">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="ai-idea-content">
                          <span className="ai-idea-category">
                            {idea.category}
                          </span>

                          <h4>{idea.title}</h4>

                          <p className="ai-idea-description">
                            {idea.description}
                          </p>

                          <div className="ai-idea-rationale">
                            <span>WHY THIS IDEA</span>
                            <p>{idea.rationale}</p>
                          </div>

                          <div className="ai-idea-evidence">
                            <span>DATA EVIDENCE</span>

                            <div>
                              {idea.evidence?.map((evidence, evidenceIndex) => (
                                <small key={evidenceIndex}>{evidence}</small>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* AI NOTE */}
                  <div className="ai-result-note">
                    <span>AI NOTE</span>

                    <p>
                      {aiInsight.note ||
                        "실제 반응 데이터를 기반으로 생성된 기획 검토용 아이디어이며 콘텐츠 성과를 예측하지 않습니다."}
                    </p>
                  </div>

                  {/* ========================================
    NEXT → BUSINESS
======================================== */}
                  <div className="creative-business-next">
                    <div className="creative-business-next-left">
                      <span>FROM CREATIVE TO BUSINESS</span>

                      <h3>
                        이 콘텐츠의 반응을
                        <br />
                        비즈니스 관점에서도 살펴볼까요?
                      </h3>

                      <p>
                        시청자 타깃과 디지털 반응을 바탕으로 광고·협찬 관점의
                        검토 신호를 확인합니다.
                      </p>
                    </div>

                    <div className="creative-business-next-right">
                      <div className="creative-business-program">
                        <span>ANALYZED PROGRAM</span>
                        <strong>{insightData.program}</strong>
                        <small>{insightData.channel}</small>
                      </div>

                      <button onClick={goToBusiness}>
                        비즈니스 신호 보기
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================
          CREATIVE MAIN
      ======================================== */}
      <main className="creative-container">
        {/* INTRO */}
        <section className="creative-intro">
          <div>
            <p>EXPLORE CREATIVE SIGNAL</p>

            <h2>
              하나의 데이터에서
              <br />
              <strong>다른 가능성을 발견합니다.</strong>
            </h2>
          </div>

          <p className="creative-intro-description">
            높은 시청률만을 기준으로 콘텐츠를 바라보지 않습니다.
            <br />
            디지털 반응과 시청자 특성을 함께 비교해
            <br />
            기획에 참고할 수 있는 콘텐츠 신호를 탐색합니다.
          </p>
        </section>

        {/* ========================================
            TAB
        ======================================== */}
        <div className={`creative-tabs ${activeTab}`}>
          <button
            className={
              activeTab === "digital"
                ? "creative-tab digital active"
                : "creative-tab digital"
            }
            onClick={() => setActiveTab("digital")}
          >
            <span>01</span>

            <div>
              <strong>DIGITAL SIGNAL</strong>
              <small>디지털 반응</small>
            </div>
          </button>

          <button
            className={
              activeTab === "young"
                ? "creative-tab young active"
                : "creative-tab young"
            }
            onClick={() => setActiveTab("young")}
          >
            <span>02</span>

            <div>
              <strong>YOUNG TARGET</strong>
              <small>20·30대 반응</small>
            </div>
          </button>

          <button
            className={
              activeTab === "hidden"
                ? "creative-tab hidden active"
                : "creative-tab hidden"
            }
            onClick={() => setActiveTab("hidden")}
          >
            <span>03</span>

            <div>
              <strong>HIDDEN SIGNAL</strong>
              <small>숨은 콘텐츠</small>
            </div>
          </button>
        </div>

        {/* ========================================
            CONTENT
        ======================================== */}
        <section className={`creative-content-section ${activeTab}`}>
          <div className="creative-section-heading">
            <div>
              <div className="creative-section-label">
                <span>{currentInfo.number}</span>
                {currentInfo.label}
              </div>

              <h2>
                <strong className={`creative-title-point ${activeTab}`}>
                  {currentInfo.titlePrefix}
                </strong>
                {currentInfo.titleSuffix}
              </h2>

              <p>{currentInfo.description}</p>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="creative-loading">
              <span></span>
              데이터를 분석하고 있습니다.
            </div>
          )}

          {/* ========================================
    PROGRAM CARDS
======================================== */}
          {!loading && (
            <div className="creative-program-list">
              {currentData.map((item, index) => {
                const metric = getMainMetric(item);

                return (
                  <article
                    className="creative-program-card"
                    key={`${item.program}-${item.channel}-${index}`}
                    onClick={() =>
                      navigate("/analysis", {
                        state: {
                          program: item.program,
                        },
                      })
                    }
                  >
                    {/* RANK */}
                    <div className="creative-rank">
                      <span>RANK</span>
                      <strong>{String(index + 1).padStart(2, "0")}</strong>
                    </div>

                    {/* POSTER */}
                    <div className="creative-poster">
                      <img
                        src={getProgramImage(item.program)}
                        alt={`${item.program} 포스터`}
                        onError={(e) => {
                          e.currentTarget.src = "/images/programs/default.jpg";
                        }}
                      />
                    </div>

                    {/* PROGRAM */}
                    <div className="creative-program-info">
                      <div className="creative-channel">{item.channel}</div>

                      <h3>{item.program}</h3>

                      <span>
                        {activeTab === "digital" && "DIGITAL REACTION"}
                        {activeTab === "young" && "YOUNG TARGET"}
                        {activeTab === "hidden" && "HIDDEN SIGNAL"}
                      </span>
                    </div>

                    {/* MAIN METRIC */}
                    <div className="creative-simple-metric">
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && currentData.length === 0 && (
            <div className="creative-empty">표시할 데이터가 없습니다.</div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Creative;
