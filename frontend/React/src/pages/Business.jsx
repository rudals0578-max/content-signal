import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import { getProgramImage } from "../data/programImages";

import "../styles/Business.css";

function Business() {
  const location = useLocation();
  const incomingData = location.state;
  // ========================================================
  // Business 페이지 진입 시 화면 맨 위로 이동
  // ========================================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);
  // ========================================================
  // 광고 조건
  // ========================================================

  const [industry, setIndustry] = useState("패션");
  const [age, setAge] = useState("20대");
  const [gender, setGender] = useState("여성");
  const [purpose, setPurpose] = useState("브랜드 인지도");

  const [metrics, setMetrics] = useState({
    digital: true,
    target: true,
    rating: false,
  });

  // ========================================================
  // 후보 분석
  // ========================================================

  const [candidates, setCandidates] = useState([]);
  const [conditions, setConditions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ========================================================
  // 상세 분석
  // ========================================================

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programDetail, setProgramDetail] = useState(null);
  const [signal, setSignal] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [candidateDetailMode, setCandidateDetailMode] = useState(false);

  // ========================================================
  // AI BUSINESS MATCH
  // ========================================================

  const [businessAi, setBusinessAi] = useState(null);
  const [businessAiLoading, setBusinessAiLoading] = useState(false);
  const [businessAiError, setBusinessAiError] = useState("");

  // 현재 상세 분석 중인 프로그램별 AI 캐시
  const businessAiCacheKey = programDetail?.program
    ? `contentSignalBusinessAi_${programDetail.program}`
    : null;

  // ========================================================
  // 중요 지표 변경
  // ========================================================

  const handleMetricChange = (name) => {
    setMetrics((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // ========================================================
  // 캠페인 목적 변경
  // ========================================================

  const handlePurposeChange = (value) => {
    setPurpose(value);

    if (value === "브랜드 인지도") {
      setMetrics({
        digital: true,
        target: true,
        rating: false,
      });
    }

    if (value === "타깃 도달") {
      setMetrics({
        digital: false,
        target: true,
        rating: false,
      });
    }

    if (value === "디지털 확산") {
      setMetrics({
        digital: true,
        target: false,
        rating: false,
      });
    }

    if (value === "대중 도달") {
      setMetrics({
        digital: false,
        target: false,
        rating: true,
      });
    }
  };

  // ========================================================
  // 후보 분석
  // ========================================================

  const analyzeCandidates = async () => {
    setLoading(true);
    setError("");

    // 새로운 조건 분석 시 기존 상세 분석 초기화
    setSelectedProgram(null);
    setProgramDetail(null);
    setSignal(null);

    setBusinessAi(null);
    setBusinessAiError("");

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/business/candidates",
        {
          params: {
            age,
            gender,
            purpose,
            digital: metrics.digital,
            target: metrics.target,
            rating: metrics.rating,
          },
        },
      );

      setCandidates(response.data.candidates || []);

      setConditions({
        industry,
        age,
        gender,
        purpose,
        ...metrics,
      });
    } catch (err) {
      console.error("후보 분석 실패:", err);

      setError("후보 분석 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // 프로그램 상세 분석
  // ========================================================

  const analyzeProgram = async (programName) => {
    setDetailLoading(true);
    setSelectedProgram(programName);
    setError("");

    // 다른 프로그램을 눌렀을 때 이전 화면 제거
    setProgramDetail(null);
    setSignal(null);
    setBusinessAi(null);
    setBusinessAiError("");

    try {
      const [detailResponse, signalResponse] = await Promise.all([
        axios.get(
          `http://127.0.0.1:8000/programs/${encodeURIComponent(programName)}`,
        ),

        axios.get(
          `http://127.0.0.1:8000/analysis/${encodeURIComponent(programName)}`,
        ),
      ]);

      setProgramDetail(detailResponse.data);
      setSignal(signalResponse.data);
    } catch (err) {
      console.error("프로그램 상세 분석 실패:", err);

      setError("프로그램 상세 데이터를 불러오지 못했습니다.");
    } finally {
      setDetailLoading(false);
    }
  };

  // ========================================================
  // Analysis / Creative에서 Business로 넘어온 경우
  // 해당 프로그램 자동 분석
  // ========================================================

  useEffect(() => {
    const incomingProgram = incomingData?.program;

    if (!incomingProgram) {
      return;
    }

    analyzeProgram(incomingProgram);
  }, [incomingData?.program]);

  // ========================================================
  // 후보 API의 percentile → 상위 %
  // ========================================================

  const getTopPercent = (percentile) => {
    if (percentile === null || percentile === undefined) {
      return "-";
    }

    const top = 100 - Number(percentile);

    return `상위 ${Math.max(0.1, top).toFixed(1)}%`;
  };

  // ========================================================
  // 분석에 사용한 지표
  // ========================================================

  const getUsedMetrics = () => {
    const used = [];

    if (metrics.target) {
      used.push(`${age} 시청률`);
      used.push(`${gender} 시청률`);
    }

    if (metrics.digital) {
      used.push("동영상 조회");
    }

    if (metrics.rating) {
      used.push("가구 시청률");
    }

    return used.length > 0 ? used.join(" · ") : "선택된 지표 없음";
  };

  // ========================================================
  // 숫자 표시
  // ========================================================

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

  // ========================================================
  // 프로그램별 Business AI 캐시 불러오기
  // ========================================================

  useEffect(() => {
    if (!businessAiCacheKey) {
      setBusinessAi(null);
      return;
    }

    const saved = sessionStorage.getItem(businessAiCacheKey);

    if (saved) {
      try {
        setBusinessAi(JSON.parse(saved));
      } catch (err) {
        console.error("Business AI 캐시 불러오기 실패:", err);

        setBusinessAi(null);
      }
    } else {
      setBusinessAi(null);
    }

    setBusinessAiError("");
  }, [businessAiCacheKey]);

  // ========================================================
  // AI 광고·협찬 검토 생성
  // ========================================================

  const generateBusinessAi = async () => {
    if (!programDetail || !signal || businessAiLoading || businessAi) {
      return;
    }

    setBusinessAiLoading(true);
    setBusinessAiError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/business/ai-match",
        {
          program: programDetail.program,

          channel: programDetail.channel || null,

          industry: industry || null,

          purpose: purpose || null,

          main_target: signal.main_target || null,

          male_rating: Number(programDetail.male_rating || 0),

          female_rating: Number(programDetail.female_rating || 0),

          household_rating: Number(programDetail.household_rating || 0),

          video_views: Number(programDetail.video_views || 0),

          comments: Number(programDetail.comments || 0),

          posts: Number(programDetail.posts || 0),

          // 다음 단계에서 실제 댓글 분석 데이터 연결
          keywords: [],

          positive: 0,
          negative: 0,
        },
      );

      if (response.data.error) {
        setBusinessAiError(response.data.error);
        return;
      }

      const aiResult = response.data.business_insight;

      setBusinessAi(aiResult);

      // 같은 프로그램은 같은 탭에서 재호출하지 않도록 저장
      if (businessAiCacheKey) {
        sessionStorage.setItem(businessAiCacheKey, JSON.stringify(aiResult));
      }
    } catch (err) {
      console.error("Business AI 생성 실패:", err);

      setBusinessAiError("AI 비즈니스 인사이트를 생성하지 못했습니다.");
    } finally {
      setBusinessAiLoading(false);
    }
  };

  return (
    <div className="business-page">
      <Header />

      {/* ====================================================
          HERO
      ==================================================== */}

      <section className="business-hero">
        <div className="business-hero-inner">
          <div className="business-hero-content">
            <div className="business-eyebrow">
              <span></span>
              BUSINESS SIGNAL
            </div>

            <h1>
              데이터에서
              <br />
              <strong>비즈니스 근거를 찾다</strong>
            </h1>

            <p>
              광고주가 원하는 타깃과 중요 지표를 설정하고,
              <br />
              시청자 · TV · 디지털 데이터를 기준으로 콘텐츠 후보를 탐색합니다.
            </p>

            <div className="business-hero-tags">
              <span>AUDIENCE</span>
              <span>TARGET</span>
              <span>DIGITAL</span>
            </div>
          </div>

          {/* HERO VISUAL */}

          <div className="business-hero-visual">
            <div className="business-orbit business-orbit-one"></div>

            <div className="business-orbit business-orbit-two"></div>

            <div className="business-core">
              <span>BUSINESS</span>
              <strong>SIGNAL</strong>
            </div>

            <div className="business-floating business-floating-target">
              <span>TARGET</span>
              <strong>Audience</strong>
              <i></i>
            </div>

            <div className="business-floating business-floating-digital">
              <span>DIGITAL</span>
              <strong>Reaction</strong>

              <div>
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>

            <div className="business-floating business-floating-tv">
              <span>TV</span>
              <strong>Rating</strong>
            </div>
          </div>
        </div>
      </section>

      <main className="business-container">
        {/* ==================================================
    FROM CONTENT SIGNAL
================================================== */}

        {incomingData?.program && (
          <section
            className="business-linked-section"
            id="business-linked-analysis"
          >
            <div className="business-linked-heading">
              <div>
                <span className="business-linked-label">
                  FROM CONTENT SIGNAL TO BUSINESS
                </span>

                <h2>
                  분석한 콘텐츠의
                  <br />
                  <strong>비즈니스 신호를 살펴봅니다.</strong>
                </h2>

                <p>
                  앞서 확인한 시청자 타깃과 디지털 반응을 바탕으로 광고·협찬
                  검토에 활용할 수 있는 신호를 확인합니다.
                </p>
              </div>

              <div className="business-linked-program">
                <div className="business-linked-poster">
                  <img
                    src={getProgramImage(
                      programDetail?.program || incomingData.program,
                    )}
                    alt={`${
                      programDetail?.program || incomingData.program
                    } 포스터`}
                    onError={(e) => {
                      e.currentTarget.src = "/images/programs/default.jpg";
                    }}
                  />
                </div>

                <div className="business-linked-program-info">
                  <span>ANALYZED PROGRAM</span>

                  <strong>
                    {programDetail?.program || incomingData.program}
                  </strong>

                  <p>{programDetail?.channel || incomingData.channel || "-"}</p>
                </div>
              </div>
            </div>

            {detailLoading && (
              <div className="business-linked-loading">
                <span></span>

                <div>
                  <strong>비즈니스 신호를 불러오고 있습니다.</strong>
                  <p>프로그램의 타깃과 디지털 데이터를 분석하고 있습니다.</p>
                </div>
              </div>
            )}

            {!detailLoading && programDetail && signal && (
              <>
                <div className="business-linked-signal-grid">
                  <article>
                    <span>MAIN AUDIENCE</span>

                    <strong>{signal.main_target || "-"}</strong>

                    <p>
                      시청률{" "}
                      <b>
                        {Number(signal.main_target_rating || 0).toFixed(2)}%
                      </b>
                    </p>
                  </article>

                  <article>
                    <span>TARGET POSITION</span>

                    <strong>
                      상위{" "}
                      {Number(signal.main_target_top_percent || 0).toFixed(1)}%
                    </strong>

                    <p>{signal.main_target || "-"} 시청률 기준</p>
                  </article>

                  <article>
                    <span>DIGITAL SIGNAL</span>

                    <strong>
                      상위 {Number(signal.video_top_percent || 0).toFixed(1)}%
                    </strong>

                    <p>
                      동영상 조회{" "}
                      <b>
                        {Math.round(
                          Number(programDetail.video_views || 0),
                        ).toLocaleString()}
                        회
                      </b>
                    </p>
                  </article>

                  <article>
                    <span>ENGAGEMENT</span>

                    <strong>
                      상위 {Number(signal.comments_top_percent || 0).toFixed(1)}
                      %
                    </strong>

                    <p>
                      댓글{" "}
                      <b>
                        {Math.round(
                          Number(programDetail.comments || 0),
                        ).toLocaleString()}
                        건
                      </b>
                    </p>
                  </article>
                </div>

                <div className="business-linked-summary">
                  <span>BUSINESS SIGNAL</span>

                  <p>
                    <strong>{programDetail.program}</strong>은 데이터상{" "}
                    <b>{signal.main_target}</b>에서 가장 높은 시청 반응을
                    보였으며, 동영상 조회는 전체 비교 기준{" "}
                    <b>
                      상위 {Number(signal.video_top_percent || 0).toFixed(1)}%
                    </b>
                    , 댓글 반응은{" "}
                    <b>
                      상위 {Number(signal.comments_top_percent || 0).toFixed(1)}
                      %
                    </b>
                    에 위치합니다.
                  </p>
                </div>
                {/* ==================================================
    AI BUSINESS MATCH
================================================== */}

                <section className="linked-business-ai">
                  <div className="linked-business-ai-heading">
                    <div>
                      <span>AI BUSINESS MATCH</span>

                      <h3>
                        이 콘텐츠에서 어떤
                        <br />
                        광고·협찬 카테고리를 검토할 수 있을까?
                      </h3>

                      <p>
                        실제 시청자 타깃과 디지털 반응을 기반으로 광고·협찬 기획
                        단계에서 검토할 수 있는 카테고리를 탐색합니다.
                      </p>
                    </div>

                    <div
                      className={
                        businessAi
                          ? "linked-business-ai-status complete"
                          : "linked-business-ai-status"
                      }
                    >
                      {businessAi ? "AI COMPLETE" : "AI READY"}
                    </div>
                  </div>

                  {/* AI 실행 전 */}
                  {!businessAi && !businessAiLoading && (
                    <div className="linked-business-ai-ready">
                      <div className="linked-business-ai-inputs">
                        <div>
                          <span>PROGRAM</span>
                          <strong>{programDetail.program}</strong>
                        </div>

                        <div>
                          <span>MAIN AUDIENCE</span>
                          <strong>{signal.main_target || "-"}</strong>
                        </div>

                        <div>
                          <span>VIDEO VIEWS</span>
                          <strong>
                            {formatNumber(programDetail.video_views)}
                          </strong>
                        </div>

                        <div>
                          <span>COMMENTS</span>
                          <strong>
                            {formatNumber(programDetail.comments)}
                          </strong>
                        </div>
                      </div>

                      <button
                        className="linked-business-ai-button"
                        onClick={generateBusinessAi}
                      >
                        <span>AI</span>
                        광고·협찬 아이템 탐색
                        <strong>→</strong>
                      </button>
                    </div>
                  )}

                  {/* AI 로딩 */}
                  {businessAiLoading && (
                    <div className="linked-business-ai-loading">
                      <div>AI</div>

                      <section>
                        <strong>비즈니스 신호를 분석하고 있습니다.</strong>

                        <p>
                          시청자 타깃과 디지털 반응을 기반으로 검토 카테고리를
                          생성하고 있습니다.
                        </p>
                      </section>
                    </div>
                  )}

                  {/* AI 오류 */}
                  {businessAiError && !businessAiLoading && (
                    <div className="linked-business-ai-error">
                      <strong>AI 분석 중 오류가 발생했습니다.</strong>

                      <p>{businessAiError}</p>

                      <button
                        onClick={() => {
                          setBusinessAiError("");
                          generateBusinessAi();
                        }}
                      >
                        다시 시도
                      </button>
                    </div>
                  )}

                  {/* AI 결과 */}
                  {businessAi && (
                    <div className="linked-business-ai-result">
                      <div className="linked-business-ai-summary">
                        <span>BUSINESS INSIGHT</span>
                        <p>{businessAi.summary}</p>
                      </div>

                      {businessAi.observed_signals?.length > 0 && (
                        <div className="linked-business-ai-signals">
                          <span>OBSERVED SIGNALS</span>

                          <div>
                            {businessAi.observed_signals.map((item, index) => (
                              <p key={index}>
                                <strong>
                                  {String(index + 1).padStart(2, "0")}
                                </strong>

                                {item}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="linked-business-ai-categories">
                        {businessAi.categories?.map((item, index) => (
                          <article key={`${item.category}-${index}`}>
                            <div className="linked-business-ai-number">
                              {String(index + 1).padStart(2, "0")}
                            </div>

                            <span>BUSINESS CATEGORY</span>

                            <h4>{item.category}</h4>

                            <div>
                              <small>MATCH POINT</small>
                              <p>{item.match_point}</p>
                            </div>

                            <div>
                              <small>ACTIVATION IDEA</small>
                              <p>{item.activation_idea}</p>
                            </div>

                            {item.evidence?.length > 0 && (
                              <div className="linked-business-evidence">
                                <small>DATA EVIDENCE</small>

                                <section>
                                  {item.evidence.map(
                                    (evidence, evidenceIndex) => (
                                      <span key={evidenceIndex}>
                                        {evidence}
                                      </span>
                                    ),
                                  )}
                                </section>
                              </div>
                            )}
                          </article>
                        ))}
                      </div>

                      <div className="linked-business-ai-note">
                        <span>AI NOTE</span>

                        <p>
                          {businessAi.note ||
                            "본 결과는 실제 콘텐츠 반응 데이터를 기반으로 생성된 광고·협찬 검토용 아이디어이며 광고 효과나 매출을 예측하지 않습니다."}
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              </>
            )}
          </section>
        )}
        {/* ==================================================
    ADVERTISER VIEW
================================================== */}

        <section className="business-advertiser-intro">
          <div className="business-advertiser-line">
            <span>FROM CONTENT TO ADVERTISER</span>
          </div>

          <div className="business-advertiser-content">
            <div>
              <span className="business-advertiser-label">ADVERTISER VIEW</span>

              <h2>
                광고주 입장이라면,
                <br />
                <strong>어떤 콘텐츠를 선택할 수 있을까?</strong>
              </h2>
            </div>
          </div>
        </section>
        {/* ==================================================
            01 CAMPAIGN SETUP
        ================================================== */}

        <section className="business-filter">
          <div className="business-section-heading">
            <div>
              <div className="business-section-label">
                <span>01</span>
                CAMPAIGN SETUP
              </div>

              <h2>광고 조건 설정</h2>

              <p>
                원하는 타깃과 캠페인 목적을 설정해 조건에 맞는 콘텐츠 후보를
                직접 탐색해보세요.
              </p>
            </div>

            <div className="business-status">
              <span></span>
              SIGNAL SETUP
            </div>
          </div>

          <div className="business-filter-panel">
            {/* SELECT */}

            <div className="business-filter-grid">
              <div className="filter-field">
                <label>
                  <span>01</span>
                  업종
                </label>

                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option>패션</option>
                  <option>뷰티</option>
                  <option>식품</option>
                  <option>자동차</option>
                  <option>IT / 디지털</option>
                  <option>금융</option>
                  <option>여행</option>
                  <option>엔터테인먼트</option>
                </select>
              </div>

              <div className="filter-field">
                <label>
                  <span>02</span>
                  목표 연령
                </label>

                <select value={age} onChange={(e) => setAge(e.target.value)}>
                  <option>10대</option>
                  <option>20대</option>
                  <option>30대</option>
                  <option>40대</option>
                  <option>50대</option>
                </select>
              </div>

              <div className="filter-field">
                <label>
                  <span>03</span>
                  목표 성별
                </label>

                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option>여성</option>
                  <option>남성</option>
                </select>
              </div>

              <div className="filter-field">
                <label>
                  <span>04</span>
                  캠페인 목적
                </label>

                <select
                  value={purpose}
                  onChange={(e) => handlePurposeChange(e.target.value)}
                >
                  <option>브랜드 인지도</option>
                  <option>타깃 도달</option>
                  <option>디지털 확산</option>
                  <option>대중 도달</option>
                </select>
              </div>
            </div>

            {/* METRIC */}

            <div className="business-metric-area">
              <div className="business-metric-title">
                <span>IMPORTANT METRIC</span>
                <strong>중요 지표</strong>
              </div>

              <div className="business-metric-grid">
                <label
                  className={
                    metrics.digital
                      ? "business-metric-card active"
                      : "business-metric-card"
                  }
                >
                  <input
                    type="checkbox"
                    checked={metrics.digital}
                    onChange={() => handleMetricChange("digital")}
                  />

                  <div>
                    <span>DIGITAL</span>
                    <strong>디지털 확산</strong>
                    <small>동영상 조회 반응</small>
                  </div>

                  <i>✓</i>
                </label>

                <label
                  className={
                    metrics.target
                      ? "business-metric-card active"
                      : "business-metric-card"
                  }
                >
                  <input
                    type="checkbox"
                    checked={metrics.target}
                    onChange={() => handleMetricChange("target")}
                  />

                  <div>
                    <span>TARGET</span>
                    <strong>타깃 도달</strong>
                    <small>연령 · 성별 시청 반응</small>
                  </div>

                  <i>✓</i>
                </label>

                <label
                  className={
                    metrics.rating
                      ? "business-metric-card active"
                      : "business-metric-card"
                  }
                >
                  <input
                    type="checkbox"
                    checked={metrics.rating}
                    onChange={() => handleMetricChange("rating")}
                  />

                  <div>
                    <span>TV</span>
                    <strong>전체 시청률</strong>
                    <small>가구 시청률</small>
                  </div>

                  <i>✓</i>
                </label>
              </div>
            </div>

            {/* BOTTOM */}

            <div className="business-filter-bottom">
              <div className="business-filter-note">
                <span>DATA NOTE</span>

                <p>
                  업종과 캠페인 목적은 탐색 조건을 설명하며, 실제 후보 비교에는
                  선택한 시청률 · 타깃 · 디지털 지표가 사용됩니다.
                </p>
              </div>

              <button
                className="business-analyze-btn"
                onClick={analyzeCandidates}
                disabled={loading}
              >
                {loading ? (
                  "분석 중..."
                ) : (
                  <>
                    후보 분석하기
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {error && <div className="business-error">{error}</div>}

        {/* ==================================================
            02 CANDIDATES
        ================================================== */}

        {conditions && (
          <section className="candidate-section">
            <div className="business-section-heading">
              <div>
                <div className="business-section-label">
                  <span>02</span>
                  CONTENT CANDIDATES
                </div>

                <h2>콘텐츠 검토 후보</h2>

                <p>선택한 데이터 조건을 기준으로 비교한 콘텐츠 후보입니다.</p>
              </div>

              <div className="candidate-condition">
                <span>SELECTED CONDITION</span>

                <strong>
                  {conditions.industry} · {conditions.age} · {conditions.gender}
                </strong>

                <small>{conditions.purpose}</small>
              </div>
            </div>

            <div className="candidate-standard">
              <span>ANALYSIS METRIC</span>

              <strong>{getUsedMetrics()}</strong>
            </div>

            {candidates.length === 0 ? (
              <div className="candidate-empty">
                조건에 해당하는 데이터를 찾지 못했습니다.
              </div>
            ) : (
              <div className="candidate-list">
                {candidates.map((item, index) => (
                  <article
                    className="candidate-card"
                    key={`${item.program}-${item.channel}`}
                  >
                    {/* RANK */}

                    <div className="candidate-rank">
                      <span>RANK</span>

                      <strong>{String(index + 1).padStart(2, "0")}</strong>
                    </div>

                    {/* POSTER */}

                    <div className="candidate-poster">
                      <img
                        src={getProgramImage(item.program)}
                        alt={`${item.program} 포스터`}
                        onError={(e) => {
                          e.currentTarget.src = "/images/programs/default.jpg";
                        }}
                      />
                    </div>

                    {/* PROGRAM */}

                    <div className="candidate-program">
                      <span>{item.channel}</span>

                      <h3>{item.program}</h3>

                      <small>CONTENT CANDIDATE</small>
                    </div>

                    {/* AGE */}

                    <div className="candidate-signal">
                      <span>{conditions.age} TARGET</span>

                      <strong>{item.age_rating ?? "-"}%</strong>

                      <small>{getTopPercent(item.age_percentile)}</small>
                    </div>

                    {/* GENDER */}

                    <div className="candidate-signal">
                      <span>{conditions.gender} TARGET</span>

                      <strong>{item.gender_rating ?? "-"}%</strong>

                      <small>{getTopPercent(item.gender_percentile)}</small>
                    </div>

                    {/* DIGITAL */}

                    <div className="candidate-signal">
                      <span>VIDEO VIEWS</span>

                      <strong>
                        {item.video_views
                          ? Math.round(item.video_views).toLocaleString()
                          : "-"}
                      </strong>

                      <small>{getTopPercent(item.digital_percentile)}</small>
                    </div>
                    <button
                      className="candidate-detail-btn"
                      onClick={() => {
                        setCandidateDetailMode(true);
                        analyzeProgram(item.program);

                        setTimeout(() => {
                          const target = incomingData?.program
                            ? document.getElementById(
                                "business-linked-analysis",
                              )
                            : document.getElementById("business-detail");

                          target?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }, 350);
                      }}
                    >
                      상세 분석
                      <span>→</span>
                    </button>
                  </article>
                ))}
              </div>
            )}

            <div className="business-method-note">
              <div>!</div>

              <p>
                <strong>분석 기준 안내</strong>
                후보는 선택한 지표의 프로그램별 상대 위치를 이용해 비교합니다.
                결과는 광고 성과나 매출을 예측하는 값이 아니라 광고 · 협찬
                검토를 위한 참고 데이터입니다.
              </p>
            </div>
          </section>
        )}

        {/* ==================================================
            03 DETAIL 후보 목록에서 직접 선택했을 때 표시
        ================================================== */}

        {selectedProgram && !incomingData?.program && (
          <section className="business-detail-section" id="business-detail">
            <div className="business-section-heading">
              <div className="business-detail-title-wrap">
                <div className="business-detail-poster">
                  <img
                    src={getProgramImage(selectedProgram)}
                    alt={`${selectedProgram} 포스터`}
                    onError={(e) => {
                      e.currentTarget.src = "/images/programs/default.jpg";
                    }}
                  />
                </div>

                <div>
                  <div className="business-section-label">
                    <span>03</span>
                    BUSINESS ANALYSIS
                  </div>

                  <h2>{selectedProgram}</h2>

                  <p>
                    선택한 후보의 타깃 · 디지털 · 참여 반응을 자세히 살펴봅니다.
                  </p>
                </div>
              </div>

              {programDetail && (
                <div className="business-detail-channel">
                  {programDetail.channel}
                </div>
              )}
            </div>

            {detailLoading ? (
              <div className="business-detail-loading">
                <span></span>
                상세 데이터를 분석하고 있습니다.
              </div>
            ) : (
              programDetail &&
              signal && (
                <>
                  {/* DETAIL CARDS */}

                  <div className="business-detail-cards">
                    <article className="business-detail-card">
                      <div className="business-card-top">
                        <span>AUDIENCE SIGNAL</span>
                        <small>01</small>
                      </div>

                      <strong>{signal.main_target}</strong>

                      <p>데이터상 주요 시청 연령층</p>

                      <div className="business-card-bottom">
                        시청률 <b>{signal.main_target_rating}%</b>
                      </div>
                    </article>

                    <article className="business-detail-card">
                      <div className="business-card-top">
                        <span>TARGET POSITION</span>
                        <small>02</small>
                      </div>

                      <strong>상위 {signal.main_target_top_percent}%</strong>

                      <p>{signal.main_target} 시청률 기준</p>

                      <div className="business-position-line">
                        <i
                          style={{
                            width: `${Math.max(
                              5,
                              100 - Number(signal.main_target_top_percent || 0),
                            )}%`,
                          }}
                        ></i>
                      </div>
                    </article>

                    <article className="business-detail-card">
                      <div className="business-card-top">
                        <span>DIGITAL SIGNAL</span>
                        <small>03</small>
                      </div>

                      <strong>상위 {signal.video_top_percent}%</strong>

                      <p>동영상 조회 기준</p>

                      <div className="business-position-line">
                        <i
                          style={{
                            width: `${Math.max(
                              5,
                              100 - Number(signal.video_top_percent || 0),
                            )}%`,
                          }}
                        ></i>
                      </div>
                    </article>

                    <article className="business-detail-card">
                      <div className="business-card-top">
                        <span>ENGAGEMENT</span>
                        <small>04</small>
                      </div>

                      <strong>상위 {signal.comments_top_percent}%</strong>

                      <p>댓글 반응 기준</p>

                      <div className="business-position-line">
                        <i
                          style={{
                            width: `${Math.max(
                              5,
                              100 - Number(signal.comments_top_percent || 0),
                            )}%`,
                          }}
                        ></i>
                      </div>
                    </article>
                  </div>

                  {/* BUSINESS SIGNAL INSIGHT */}

                  <section className="business-detail-insight">
                    <div className="business-insight-heading">
                      <div>
                        <p>BUSINESS SIGNAL INSIGHT</p>

                        <h3>
                          데이터를 통해 살펴본
                          <br />
                          <strong>콘텐츠의 비즈니스 신호</strong>
                        </h3>
                      </div>

                      <div className="business-insight-symbol">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>

                    <div className="business-insight-grid">
                      <article>
                        <span>01 · AUDIENCE</span>

                        <strong>{signal.main_target}</strong>

                        <p>
                          데이터상 가장 높은 시청률을 보인 연령층이며 해당
                          연령대 시청률은 <b>{signal.main_target_rating}%</b>
                          입니다.
                        </p>
                      </article>

                      <article>
                        <span>02 · DIGITAL</span>

                        <strong>상위 {signal.video_top_percent}%</strong>

                        <p>
                          분석 기간 내 프로그램과 비교한 동영상 조회 반응의
                          상대적 위치입니다.
                        </p>
                      </article>

                      <article>
                        <span>03 · ENGAGEMENT</span>

                        <strong>상위 {signal.comments_top_percent}%</strong>

                        <p>
                          분석 기간 내 프로그램과 비교한 댓글 반응의 상대적
                          위치입니다.
                        </p>
                      </article>
                    </div>

                    <div className="business-insight-note">
                      <span>DATA NOTE</span>

                      <p>
                        본 분석은 실제 콘텐츠 데이터에서 나타난 시청자 및 디지털
                        반응을 광고 · 협찬 검토의 참고 자료로 제공하며 광고
                        효과, 매출 또는 향후 성과를 예측하지 않습니다.
                      </p>
                    </div>
                  </section>

                  {/* ==================================================
                      04 AI BUSINESS MATCH
                  ================================================== */}

                  <section className="business-ai-section">
                    <div className="business-ai-heading">
                      <div>
                        <span>04 · AI BUSINESS MATCH</span>

                        <h2>
                          이 콘텐츠에서 어떤
                          <br />
                          광고·협찬 카테고리를 검토할 수 있을까?
                        </h2>

                        <p>
                          실제 시청자와 디지털 반응을 기반으로 광고 및 협찬 기획
                          단계에서 검토할 수 있는 카테고리를 탐색합니다.
                        </p>
                      </div>

                      <div
                        className={
                          businessAi
                            ? "business-ai-status complete"
                            : "business-ai-status"
                        }
                      >
                        {businessAi ? "AI COMPLETE" : "AI READY"}
                      </div>
                    </div>

                    {/* AI 실행 전 */}

                    {!businessAi && !businessAiLoading && (
                      <div className="business-ai-ready">
                        <div className="business-ai-data">
                          <div>
                            <span>PROGRAM</span>

                            <strong>{programDetail.program}</strong>
                          </div>

                          <div>
                            <span>MAIN AUDIENCE</span>

                            <strong>{signal.main_target || "-"}</strong>
                          </div>

                          <div>
                            <span>VIDEO VIEWS</span>

                            <strong>
                              {formatNumber(programDetail.video_views)}
                            </strong>
                          </div>

                          <div>
                            <span>COMMENTS</span>

                            <strong>
                              {formatNumber(programDetail.comments)}
                            </strong>
                          </div>
                        </div>

                        <button
                          className="business-ai-button"
                          onClick={generateBusinessAi}
                        >
                          <span>AI</span>
                          광고·협찬 아이템 탐색
                          <strong>→</strong>
                        </button>
                      </div>
                    )}

                    {/* AI LOADING */}

                    {businessAiLoading && (
                      <div className="business-ai-loading">
                        <div>AI</div>

                        <section>
                          <strong>비즈니스 신호를 분석하고 있습니다.</strong>

                          <p>
                            시청자 타깃과 디지털 반응을 기반으로 검토 카테고리를
                            생성하고 있습니다.
                          </p>
                        </section>
                      </div>
                    )}

                    {/* ERROR */}

                    {businessAiError && !businessAiLoading && (
                      <div className="business-ai-error">
                        <strong>AI 분석 중 오류가 발생했습니다.</strong>

                        <p>{businessAiError}</p>
                      </div>
                    )}

                    {/* AI RESULT */}

                    {businessAi && (
                      <div className="business-ai-result">
                        {/* SUMMARY */}

                        <div className="business-ai-summary">
                          <span>BUSINESS INSIGHT</span>

                          <p>{businessAi.summary}</p>
                        </div>

                        {/* OBSERVED SIGNALS */}

                        {businessAi.observed_signals?.length > 0 && (
                          <div className="business-ai-signals">
                            <span>OBSERVED SIGNALS</span>

                            {businessAi.observed_signals.map((item, index) => (
                              <p key={index}>
                                <strong>
                                  {String(index + 1).padStart(2, "0")}
                                </strong>

                                {item}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* CATEGORY CARDS */}

                        <div className="business-ai-categories">
                          {businessAi.categories?.map((item, index) => (
                            <article
                              className="business-ai-card"
                              key={`${item.category}-${index}`}
                            >
                              <div className="business-ai-number">
                                {String(index + 1).padStart(2, "0")}
                              </div>

                              <span>BUSINESS CATEGORY</span>

                              <h3>{item.category}</h3>

                              <div className="business-ai-point">
                                <small>MATCH POINT</small>

                                <p>{item.match_point}</p>
                              </div>

                              <div className="business-ai-activation">
                                <small>ACTIVATION IDEA</small>

                                <p>{item.activation_idea}</p>
                              </div>

                              <div className="business-ai-evidence">
                                <small>DATA EVIDENCE</small>

                                <div>
                                  {item.evidence?.map(
                                    (evidence, evidenceIndex) => (
                                      <span key={evidenceIndex}>
                                        {evidence}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>

                        {/* NOTE */}

                        <div className="business-ai-note">
                          <span>AI NOTE</span>

                          <p>
                            {businessAi.note ||
                              "본 결과는 실제 콘텐츠 반응 데이터를 기반으로 생성된 광고·협찬 검토용 아이디어이며 광고 효과나 매출을 예측하지 않습니다."}
                          </p>
                        </div>
                      </div>
                    )}
                  </section>
                </>
              )
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Business;
