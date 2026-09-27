import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";



import Header from "../components/Header";

import { getProgramImage } from "../data/programImages";



import "../styles/Analysis.css";



import {

  LineChart,

  Line,

  XAxis,

  YAxis,

  CartesianGrid,

  Tooltip,

  ResponsiveContainer,

  Legend,

  PieChart,

  Pie,

  Cell,

} from "recharts";



function Analysis() {

  const navigate = useNavigate();

  const location = useLocation();



  const [programs, setPrograms] = useState([]);

  const [search, setSearch] = useState("");

  const [result, setResult] = useState(null);

  const [signal, setSignal] = useState(null);

  const [loading, setLoading] = useState(false);



  const [weeklyData, setWeeklyData] = useState([]);

  const [digitalMetric, setDigitalMetric] = useState("video_views");

  const [commentData, setCommentData] = useState(null);



  const demoPrograms = [

    {

      name: "김부장",

      label: "TV + DIGITAL",

    },

    {

      name: "신입사원 강회장",

      label: "WEEKLY SIGNAL",

    },

    {

      name: "스트릿 월드 파이터 : 디렉터스 워",

      label: "DIGITAL SIGNAL",

    },

    {

      name: "유 퀴즈 온 더 블럭",

      label: "COMMENT SIGNAL",

    },

  ];



  // ==================================================

  // 프로그램 목록

  // ==================================================

  useEffect(() => {

    axios

      .get("http://127.0.0.1:8000/programs")

      .then((response) => {

        setPrograms(response.data);

      })

      .catch((error) => {

        console.error("프로그램 목록 불러오기 실패:", error);

      });

  }, []);



  // ==================================================

  // 전체 프로그램 개수

  // ==================================================

  const totalPrograms = new Set(

    programs.map((item) => item.program?.trim()).filter(Boolean),

  ).size;



  // ==================================================

  // 검색 결과

  // ==================================================

  const filteredPrograms = programs

    .filter((item) =>

      item.program?.toLowerCase().includes(search.toLowerCase()),

    )

    .slice(0, 8);



  // ==================================================

  // 프로그램 분석

  // ==================================================

  const analyzeProgram = async (programName = search) => {

    if (!programName.trim()) {

      alert("프로그램명을 입력해주세요.");

      return;

    }



    try {

      setLoading(true);



      const encodedName = encodeURIComponent(programName);



      const [detailResponse, signalResponse, weeklyResponse, commentResponse] =

        await Promise.all([

          axios.get(`http://127.0.0.1:8000/programs/${encodedName}`),

          axios.get(`http://127.0.0.1:8000/analysis/${encodedName}`),

          axios.get(`http://127.0.0.1:8000/programs/${encodedName}/weekly`),

          axios.get(`http://127.0.0.1:8000/programs/${encodedName}/comments`),

        ]);



      console.log("DETAIL:", detailResponse.data);

      console.log("SIGNAL:", signalResponse.data);

      console.log("WEEKLY:", weeklyResponse.data);

      console.log("COMMENT:", commentResponse.data);



      setResult(detailResponse.data);

      setSignal(signalResponse.data);

      setWeeklyData(weeklyResponse.data.weekly || []);

      setCommentData(commentResponse.data);

      setSearch(programName);

    } catch (error) {

      console.error("분석 실패:", error);

      alert("프로그램 분석 데이터를 가져오지 못했습니다.");

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    const selectedProgram = location.state?.program;



    if (selectedProgram) {

      setSearch(selectedProgram);

      analyzeProgram(selectedProgram);



      window.history.replaceState({}, document.title);

    }

  }, [location.state]);

  // ==================================================

  // 검색창 변경

  // ==================================================

  const handleSearchChange = (e) => {

    setSearch(e.target.value);



    setResult(null);

    setSignal(null);

    setWeeklyData([]);

    setCommentData(null);

  };



  // ==================================================

  // 연령별 데이터

  // ==================================================

  const ageData = result

    ? [

      { label: "10대", value: result.age10_rating },

      { label: "20대", value: result.age20_rating },

      { label: "30대", value: result.age30_rating },

      { label: "40대", value: result.age40_rating },

      { label: "50대", value: result.age50_rating },

    ]

    : [];



  // ==================================================

  // 강한 성별

  // ==================================================

  const strongestGender =

    result && Number(result.male_rating) > Number(result.female_rating)

      ? "남성"

      : "여성";



  const strongestGenderRating = result

    ? strongestGender === "남성"

      ? Number(result.male_rating || 0)

      : Number(result.female_rating || 0)

    : 0;



  // ==================================================

  // 연령 그래프 최대값

  // ==================================================

  const maxAgeRating =

    ageData.length > 0

      ? Math.max(...ageData.map((item) => Number(item.value) || 0))

      : 0;



  // ==================================================

  // 상대 순위 라벨

  // ==================================================

  const getRankLabel = (percent) => {

    const value = Number(percent);



    if (value <= 1) return "최상위권";

    if (value <= 10) return "상위권";

    if (value <= 30) return "중상위권";

    if (value <= 70) return "중위권";



    return "하위권";

  };



  const getRankClass = (percent) => {

    const value = Number(percent);



    if (value <= 1) return "rank-best";

    if (value <= 10) return "rank-high";

    if (value <= 30) return "rank-middle";

    if (value <= 70) return "rank-normal";



    return "rank-low";

  };



  // ==================================================

  // 디지털 지표

  // ==================================================

  const digitalMetrics = {

    video_views: {

      label: "동영상 조회",

      shortLabel: "VIDEO",

      icon: "▶",

      dataKey: "video_views",

      description: "영상 콘텐츠의 확산 규모",

    },



    comments: {

      label: "댓글",

      shortLabel: "COMMENT",

      icon: "💬",

      dataKey: "comments",

      description: "시청자의 직접적인 참여 반응",

    },



    posts: {

      label: "게시글",

      shortLabel: "POST",

      icon: "▤",

      dataKey: "posts",

      description: "온라인에서 생성된 이야기량",

    },

  };



  const currentDigitalMetric = digitalMetrics[digitalMetric];



  // ==================================================

  // 숫자 표시

  // ==================================================

  const formatDigitalValue = (value) => {

    const number = Number(value) || 0;



    if (number >= 10000000) {

      return `${(number / 10000000).toFixed(1)}천만`;

    }



    if (number >= 10000) {

      return `${(number / 10000).toFixed(1)}만`;

    }



    return number.toLocaleString();

  };



  // ==================================================

  // 디지털 최고 주차

  // ==================================================

  const digitalPeak =

    weeklyData.length > 0

      ? weeklyData.reduce((maxItem, item) =>

        Number(item[digitalMetric]) > Number(maxItem[digitalMetric])

          ? item

          : maxItem,

      )

      : null;



  // ==================================================

  // 분석 기간

  // ==================================================

  const analysisPeriod =

    weeklyData.length > 0

      ? `${weeklyData[0].week} ~ ${weeklyData[weeklyData.length - 1].week}`

      : "";



  // ==================================================

  // TV vs DIGITAL 비교

  // ==================================================

  const tvDigitalData = (() => {

    if (weeklyData.length === 0) return [];



    const maxRating = Math.max(

      ...weeklyData.map((item) => Number(item.household_rating) || 0),

    );



    const maxVideoViews = Math.max(

      ...weeklyData.map((item) => Number(item.video_views) || 0),

    );



    return weeklyData.map((item) => ({

      week: item.week,



      tvIndex:

        maxRating > 0

          ? ((Number(item.household_rating) || 0) / maxRating) * 100

          : 0,



      digitalIndex:

        maxVideoViews > 0

          ? ((Number(item.video_views) || 0) / maxVideoViews) * 100

          : 0,



      originalRating: Number(item.household_rating) || 0,

      originalVideoViews: Number(item.video_views) || 0,

    }));

  })();



  // ==================================================

  // TV vs DIGITAL Tooltip

  // ==================================================

  const TvDigitalTooltip = ({ active, payload, label }) => {

    if (!active || !payload || payload.length === 0) {

      return null;

    }



    const row = payload[0]?.payload;



    return (

      <div

        style={{

          background: "#ffffff",

          border: "1px solid #e5e5ed",

          borderRadius: "12px",

          padding: "12px 14px",

          boxShadow: "0 8px 24px rgba(30, 30, 50, 0.08)",

        }}

      >

        <strong

          style={{

            display: "block",

            marginBottom: "8px",

            fontSize: "12px",

          }}

        >

          {label}

        </strong>



        <div

          style={{

            fontSize: "11px",

            lineHeight: "1.8",

            color: "#666978",

          }}

        >

          <div>

            TV 상대 지수{" "}

            <b style={{ color: "#635bff" }}>

              {Number(row?.tvIndex || 0).toFixed(1)}

            </b>

          </div>



          <div>

            가구 시청률 <b>{Number(row?.originalRating || 0).toFixed(2)}%</b>

          </div>



          <div>

            온라인 상대 지수{" "}

            <b style={{ color: "#a78bfa" }}>

              {Number(row?.digitalIndex || 0).toFixed(1)}

            </b>

          </div>



          <div>

            동영상 조회{" "}

            <b>{Number(row?.originalVideoViews || 0).toLocaleString()}회</b>

          </div>

        </div>

      </div>

    );

  };



  // ==================================================

  // Creative 이동

  // ==================================================

  const goToCreativeInsight = () => {

    if (!result || !commentData) return;



    navigate("/creative", {

      state: {

        program: result.program,

        channel: result.channel,



        keywords: commentData.keywords || [],

        sentiment: commentData.sentiment || {

          positive: 0,

          negative: 0,

        },

        commentWeek: commentData.week,



        weekly: weeklyData,



        target: {

          mainTarget: signal?.main_target,

          mainTargetRating: signal?.main_target_rating,

          maleRating: result.male_rating,

          femaleRating: result.female_rating,

        },



        digital: {

          videoViews: result.video_views,

          comments: result.comments,

          posts: result.posts,

        },

      },

    });

  };



  const goToBusinessInsight = () => {

    if (!result) return;



    navigate("/business", {

      state: {

        program: result.program,

        channel: result.channel,



        target: {

          mainTarget: signal?.main_target,

          mainTargetRating: signal?.main_target_rating,

          maleRating: result.male_rating,

          femaleRating: result.female_rating,

        },



        digital: {

          videoViews: result.video_views,

          comments: result.comments,

          posts: result.posts,

        },



        signal: signal,

      },

    });

  };



  return (

    <div className="analysis-page">

      <Header />



      <section className="analysis-hero">

        <div className="analysis-hero-inner">

          <div className="analysis-hero-content">

            <div className="analysis-eyebrow">

              <span></span>

              CONTENT SIGNAL

            </div>



            <h1>

              콘텐츠의 반응을

              <br />

              <strong>데이터로 읽다</strong>

            </h1>



            <p>

              프로그램을 검색하면 시청률 · 타깃 · 디지털 반응을

              <br />

              하나의 화면에서 비교하고 분석할 수 있습니다.

            </p>



            <div className="analysis-search-area">

              <div className="analysis-search-input">

                <span className="search-icon">⌕</span>



                <input

                  type="text"

                  value={search}

                  placeholder="프로그램명을 검색하세요"

                  onChange={handleSearchChange}

                  onKeyDown={(e) => {

                    if (e.key === "Enter") {

                      analyzeProgram();

                    }

                  }}

                />



                {search && !result && (

                  <div className="search-results">

                    {filteredPrograms.length > 0 ? (

                      filteredPrograms.map((item, index) => (

                        <button

                          key={`${item.program}-${item.channel}-${index}`}

                          className="analysis-search-result-item"

                          onClick={() => {

                            setSearch(item.program);

                            analyzeProgram(item.program);

                          }}

                        >

                          {/* 포스터 */}

                          <img

                            src={getProgramImage(item.program)}

                            alt={`${item.program} 포스터`}

                            onError={(e) => {

                              e.currentTarget.src =

                                "/images/programs/default.jpg";

                            }}

                          />



                          {/* 프로그램 정보 */}

                          <div className="analysis-search-result-info">

                            <span>{item.channel || "PROGRAM"}</span>

                            <strong>{item.program}</strong>

                          </div>

                        </button>

                      ))

                    ) : (

                      <div className="analysis-search-empty">

                        검색 결과가 없습니다.

                      </div>

                    )}

                  </div>

                )}

              </div>



              <button

                className="analysis-search-button"

                onClick={() => analyzeProgram()}

                disabled={loading}

              >

                {loading ? "분석 중..." : "분석하기"}

                {!loading && <span>→</span>}

              </button>

            </div>



            <div className="demo-program-area">
              <div className="demo-program-info">
                <strong>DEMO PROGRAM</strong>
                <span>전체 기능 확인 가능</span>
              </div>

              <p>
                아래 프로그램은 주차별 반응과 댓글 분석까지 포함된 상세 DEMO를 제공합니다.
              </p>

              <div className="demo-program-list">
                {demoPrograms.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className="demo-program-button"
                    onClick={() => {
                      setSearch(item.name);
                      analyzeProgram(item.name);
                    }}
                    disabled={loading}
                  >
                    <strong>{item.name}</strong>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="analysis-source">
              RACOI DATA · TV · TARGET · DIGITAL
            </div>
          </div>

        <div className="analysis-hero-visual">

          <div className="analysis-orbit orbit-one"></div>

          <div className="analysis-orbit orbit-two"></div>



          <div className="analysis-core">

            <span>CONTENT</span>

            <strong>SIGNAL</strong>

          </div>



          <div className="analysis-floating-card floating-tv">

            <span>TV</span>

            <strong>📺 시청률</strong>

            <i></i>

          </div>



          <div className="analysis-floating-card floating-target">

            <span>TARGET</span>

            <strong>◎ 연령 · 성별</strong>



            <div className="mini-target-bars">

              <i style={{ width: "35%" }}></i>

              <i style={{ width: "58%" }}></i>

              <i style={{ width: "78%" }}></i>

            </div>

          </div>



          <div className="analysis-floating-card floating-digital">

            <span>DIGITAL</span>

            <strong>▶ 온라인 반응</strong>



            <div className="mini-digital-chart">

              <i style={{ height: "35%" }}></i>

              <i style={{ height: "55%" }}></i>

              <i style={{ height: "42%" }}></i>

              <i style={{ height: "80%" }}></i>

              <i style={{ height: "65%" }}></i>

            </div>

          </div>

        </div>

    </div>

      </section>



    <main className="analysis-container">

      {!result && (

        <section className="analysis-empty-state">

          <p>CONTENT ANALYSIS</p>

          <h2>분석할 프로그램을 검색해주세요.</h2>

          <span>

            시청률 · 타깃 · 디지털 반응을 한 화면에서 확인할 수 있습니다.

          </span>

        </section>

      )}



      {result && (

        <section className="analysis-result">

          <div className="analysis-result-header">

            <div className="analysis-program-header">

              <div className="analysis-program-poster">

                <img

                  src={getProgramImage(result.program)}

                  alt={`${result.program} 포스터`}

                  onError={(e) => {

                    e.currentTarget.src = "/images/programs/default.jpg";

                  }}

                />

              </div>



              <div className="analysis-program-header-info">

                <p>PROGRAM ANALYSIS</p>



                <div className="program-title-row">

                  <h2>{result.program}</h2>

                  <span>{result.channel}</span>

                </div>



                <small>TV · DIGITAL · TARGET SIGNAL ANALYSIS</small>

              </div>

            </div>



            <div className="result-status">

              <span></span>

              ANALYSIS COMPLETE

            </div>

          </div>



          <div className="analysis-dashboard-grid">

            <article className="analysis-data-card tv-data-card">

              <div className="data-card-header">

                <div>

                  <span>TV SIGNAL</span>

                  <h3>

                    <span className="title-icon">📺</span>

                    시청 성과

                  </h3>

                </div>



                <div className="data-card-number">01</div>

              </div>



              <div className="main-metric">

                <strong>

                  {Number(result.household_rating || 0).toFixed(2)}

                  <small>%</small>

                </strong>



                <span>가구 시청률</span>

              </div>



              <div className="tv-visual">

                <span style={{ height: "32%" }}></span>

                <span style={{ height: "46%" }}></span>

                <span style={{ height: "41%" }}></span>

                <span style={{ height: "62%" }}></span>

                <span style={{ height: "72%" }}></span>

                <span style={{ height: "88%" }}></span>

              </div>

            </article>



            <article className="analysis-data-card digital-data-card">

              <div className="data-card-header">

                <div>

                  <span>DIGITAL SIGNAL</span>



                  <h3>

                    <span className="title-icon">◉</span>

                    온라인 반응

                  </h3>

                </div>



                <div className="data-card-number">02</div>

              </div>



              <div className="digital-main">

                <div className="digital-metric-label">

                  <span className="metric-icon video-icon">▶</span>

                  <span>동영상 조회</span>

                </div>



                <strong>

                  {Math.round(

                    Number(result.video_views || 0),

                  ).toLocaleString()}

                </strong>



                <small>회</small>

              </div>



              <div className="digital-metrics">

                <div>

                  <div className="mini-metric-title">

                    <span className="metric-icon comment-icon">💬</span>

                    <span>댓글</span>

                  </div>



                  <strong>

                    {Math.round(

                      Number(result.comments || 0),

                    ).toLocaleString()}

                  </strong>

                </div>



                <div>

                  <div className="mini-metric-title">

                    <span className="metric-icon post-icon">▤</span>

                    <span>게시글</span>

                  </div>



                  <strong>

                    {Math.round(Number(result.posts || 0)).toLocaleString()}

                  </strong>

                </div>

              </div>

            </article>



            <article className="analysis-data-card target-data-card">

              <div className="data-card-header">

                <div>

                  <span>TARGET SIGNAL</span>



                  <h3>

                    <span className="title-icon">◎</span>

                    시청자 타깃

                  </h3>

                </div>



                <div className="data-card-number">03</div>

              </div>



              <div className="analysis-gender-grid">

                <div

                  className={`gender-item male-item ${strongestGender === "남성" ? "gender-active" : ""

                    }`}

                >

                  <div className="gender-label">

                    <span className="gender-icon">♂</span>

                    <span>남성</span>

                  </div>



                  <strong>

                    {Number(result.male_rating || 0).toFixed(2)}%

                  </strong>



                  {strongestGender === "남성" && (

                    <small>상대적으로 높은 성별</small>

                  )}

                </div>



                <div

                  className={`gender-item female-item ${strongestGender === "여성" ? "gender-active" : ""

                    }`}

                >

                  <div className="gender-label">

                    <span className="gender-icon">♀</span>

                    <span>여성</span>

                  </div>



                  <strong>

                    {Number(result.female_rating || 0).toFixed(2)}%

                  </strong>



                  {strongestGender === "여성" && (

                    <small>상대적으로 높은 성별</small>

                  )}

                </div>

              </div>



              <div className="analysis-age-chart">

                {ageData.map((item) => {

                  const value = Number(item.value) || 0;

                  const isMainTarget = signal?.main_target === item.label;



                  return (

                    <div

                      className={

                        isMainTarget

                          ? "analysis-age-row age-active"

                          : "analysis-age-row"

                      }

                      key={item.label}

                    >

                      <span>{item.label}</span>



                      <div className="analysis-bar-bg">

                        <div

                          className="analysis-bar"

                          style={{

                            width:

                              maxAgeRating > 0

                                ? `${(value / maxAgeRating) * 100}%`

                                : "0%",

                          }}

                        ></div>

                      </div>



                      <strong>{value.toFixed(2)}%</strong>

                    </div>

                  );

                })}

              </div>

            </article>

          </div>



          {signal && !signal.error && (

            <div className="analysis-key-summary">

              <span>KEY SIGNAL</span>



              <p>

                <strong>{result.program}</strong>은{" "}

                <b>{signal.main_target}</b>에서 가장 높은 시청률{" "}

                <b>{Number(signal.main_target_rating || 0).toFixed(2)}%</b>을

                보였으며, 성별 기준 <b>{strongestGender}</b> 시청률{" "}

                <b>{strongestGenderRating.toFixed(2)}%</b>이 상대적으로 높고,

                평균 동영상 조회는{" "}

                <b>

                  {Math.round(

                    Number(result.video_views || 0),

                  ).toLocaleString()}

                  회

                </b>

                입니다.

              </p>

            </div>

          )}



          {signal && !signal.error && (

            <section className="compare-section">

              <div className="compare-heading">

                <div>

                  <span className="section-label">COMPARE SIGNAL</span>

                  <h2>전체 프로그램과 비교하면?</h2>



                  <p>

                    분석 기간 내{" "}

                    <strong>약 {totalPrograms || "전체"}개 프로그램</strong>을

                    기준으로 상대적 위치를 비교했습니다.

                  </p>

                </div>



                <div className="compare-badge">

                  <span>RELATIVE POSITION</span>

                  <strong>상대 비교</strong>

                </div>

              </div>



              <div className="compare-grid">

                <article

                  className={`compare-card ${getRankClass(

                    signal.household_top_percent,

                  )}`}

                >

                  <div className="compare-card-top">

                    <div className="compare-icon tv-compare-icon">📺</div>



                    <div className="compare-title">

                      <span>TV SIGNAL</span>

                      <h3>TV 시청률</h3>

                    </div>



                    <small>01</small>

                  </div>



                  <div className="compare-rank">

                    <strong>

                      <span className="rank-symbol">♛</span>

                      {getRankLabel(signal.household_top_percent)}

                    </strong>



                    <p>약 {totalPrograms || "전체"}개 프로그램 중</p>

                    <b>상위 {signal.household_top_percent}%</b>

                  </div>



                  <div className="compare-standard">

                    <div className="standard-icon">▥</div>



                    <div>

                      <span>비교 기준</span>

                      <strong>가구 시청률 기준</strong>

                    </div>

                  </div>

                </article>



                <article

                  className={`compare-card ${getRankClass(

                    signal.main_target_top_percent,

                  )}`}

                >

                  <div className="compare-card-top">

                    <div className="compare-icon target-compare-icon">◎</div>



                    <div className="compare-title">

                      <span>TARGET SIGNAL</span>

                      <h3>주요 타깃</h3>

                    </div>



                    <small>02</small>

                  </div>



                  <div className="compare-rank">

                    <strong>

                      <span className="rank-symbol">♛</span>

                      {getRankLabel(signal.main_target_top_percent)}

                    </strong>



                    <p>약 {totalPrograms || "전체"}개 프로그램 중</p>

                    <b>상위 {signal.main_target_top_percent}%</b>

                  </div>



                  <div className="compare-standard">

                    <div className="standard-icon">◎</div>



                    <div>

                      <span>비교 기준</span>

                      <strong>{signal.main_target} 시청률 기준</strong>

                    </div>

                  </div>

                </article>



                <article

                  className={`compare-card ${getRankClass(

                    signal.video_top_percent,

                  )}`}

                >

                  <div className="compare-card-top">

                    <div className="compare-icon digital-compare-icon">▶</div>



                    <div className="compare-title">

                      <span>DIGITAL SIGNAL</span>

                      <h3>온라인 화제성</h3>

                    </div>



                    <small>03</small>

                  </div>



                  <div className="compare-rank">

                    <strong>

                      <span className="rank-symbol">♛</span>

                      {getRankLabel(signal.video_top_percent)}

                    </strong>



                    <p>약 {totalPrograms || "전체"}개 프로그램 중</p>

                    <b>상위 {signal.video_top_percent}%</b>

                  </div>



                  <div className="compare-standard">

                    <div className="standard-icon">▶</div>



                    <div>

                      <span>비교 기준</span>

                      <strong>동영상 조회 기준</strong>

                    </div>

                  </div>

                </article>



                <article

                  className={`compare-card ${getRankClass(

                    signal.comments_top_percent,

                  )}`}

                >

                  <div className="compare-card-top">

                    <div className="compare-icon comment-compare-icon">

                      💬

                    </div>



                    <div className="compare-title">

                      <span>ENGAGEMENT</span>

                      <h3>댓글 참여</h3>

                    </div>



                    <small>04</small>

                  </div>



                  <div className="compare-rank">

                    <strong>

                      <span className="rank-symbol">↗</span>

                      {getRankLabel(signal.comments_top_percent)}

                    </strong>



                    <p>약 {totalPrograms || "전체"}개 프로그램 중</p>

                    <b>상위 {signal.comments_top_percent}%</b>

                  </div>



                  <div className="compare-standard">

                    <div className="standard-icon comment-standard-icon">

                      💬

                    </div>



                    <div>

                      <span>비교 기준</span>

                      <strong>댓글 수 기준</strong>

                    </div>

                  </div>

                </article>

              </div>

            </section>

          )}



          {weeklyData.length > 0 && (

            <section className="trend-section">

              <div className="trend-heading">

                <span className="section-label">TV vs DIGITAL</span>



                <h2>TV 시청과 온라인 반응은 같이 움직였을까?</h2>



                <p>

                  가구 시청률과 동영상 조회의 주차별 변화 흐름을 같은 기준으로

                  비교합니다.

                </p>

              </div>



              <div className="trend-chart-card">

                <div className="trend-chart-header">

                  <div>

                    <span className="chart-label">WEEKLY SIGNAL INDEX</span>

                    <h3>📈 TV · 온라인 반응 비교</h3>

                  </div>



                  <span className="trend-period">{analysisPeriod}</span>

                </div>



                <div className="trend-chart">

                  <ResponsiveContainer width="100%" height={360}>

                    <LineChart

                      data={tvDigitalData}

                      margin={{

                        top: 20,

                        right: 30,

                        left: 10,

                        bottom: 10,

                      }}

                    >

                      <CartesianGrid strokeDasharray="3 3" vertical={false} />



                      <XAxis

                        dataKey="week"

                        tickLine={false}

                        axisLine={false}

                      />



                      <YAxis

                        domain={[0, 100]}

                        tickLine={false}

                        axisLine={false}

                      />



                      <Tooltip content={<TvDigitalTooltip />} />

                      <Legend />



                      <Line

                        type="monotone"

                        dataKey="tvIndex"

                        name="TV 시청"

                        stroke="#635bff"

                        strokeWidth={3}

                        dot={{

                          r: 5,

                          fill: "#ffffff",

                          strokeWidth: 3,

                        }}

                        activeDot={{ r: 7 }}

                      />



                      <Line

                        type="monotone"

                        dataKey="digitalIndex"

                        name="온라인 반응"

                        stroke="#f57178"

                        strokeWidth={3}

                        dot={{

                          r: 5,

                          fill: "#ffffff",

                          strokeWidth: 3,

                        }}

                        activeDot={{ r: 7 }}

                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>



                <div className="trend-index-note">

                  <strong>비교 기준</strong>



                  <p>

                    서로 다른 단위의 흐름을 비교하기 위해 가구 시청률과 동영상

                    조회 각각의 방영 기간 내 최고값을 100으로 변환한 상대

                    지수입니다. 원자료의 실제 수치는 그래프에 마우스를 올려

                    확인할 수 있습니다.

                  </p>

                </div>

              </div>

            </section>

          )}



          {weeklyData.length > 0 && (

            <section className="digital-trend-section">

              <div className="digital-trend-heading">

                <div>

                  <span className="section-label">DIGITAL REACTION</span>



                  <h2>온라인 반응은 언제 움직였을까?</h2>



                  <p>

                    동영상 조회 · 댓글 · 게시글의 주차별 변화를 살펴보며

                    온라인 반응의 흐름을 확인합니다.

                  </p>

                </div>



                {digitalPeak && (

                  <div className="digital-peak-summary">

                    <span>PEAK SIGNAL</span>

                    <strong>{digitalPeak.week}</strong>



                    <p>

                      {currentDigitalMetric.icon} {currentDigitalMetric.label}{" "}

                      <b>{formatDigitalValue(digitalPeak[digitalMetric])}</b>

                    </p>

                  </div>

                )}

              </div>



              <div className="digital-trend-card">

                <div className="digital-metric-tabs">

                  {Object.entries(digitalMetrics).map(([key, metric]) => (

                    <button

                      key={key}

                      className={

                        digitalMetric === key

                          ? "digital-metric-button active"

                          : "digital-metric-button"

                      }

                      onClick={() => setDigitalMetric(key)}

                    >

                      <div className="digital-tab-icon">{metric.icon}</div>



                      <div className="digital-tab-content">

                        <span>{metric.shortLabel}</span>

                        <strong>{metric.label}</strong>

                        <p>{metric.description}</p>

                      </div>

                    </button>

                  ))}

                </div>



                <div className="digital-chart-header">

                  <div>

                    <span>{currentDigitalMetric.shortLabel}</span>



                    <h3>

                      {currentDigitalMetric.icon} {currentDigitalMetric.label}{" "}

                      변화

                    </h3>

                  </div>



                  <p>{analysisPeriod}</p>

                </div>



                <div className="digital-reaction-chart">

                  <ResponsiveContainer width="100%" height={350}>

                    <LineChart

                      data={weeklyData}

                      margin={{

                        top: 20,

                        right: 30,

                        left: 20,

                        bottom: 10,

                      }}

                    >

                      <CartesianGrid strokeDasharray="3 3" vertical={false} />



                      <XAxis

                        dataKey="week"

                        tickLine={false}

                        axisLine={false}

                      />



                      <YAxis

                        tickLine={false}

                        axisLine={false}

                        tickFormatter={formatDigitalValue}

                      />



                      <Tooltip

                        formatter={(value) => [

                          Number(value).toLocaleString(),

                          currentDigitalMetric.label,

                        ]}

                      />



                      <Line

                        type="monotone"

                        dataKey={currentDigitalMetric.dataKey}

                        name={currentDigitalMetric.label}

                        stroke="#635bff"

                        strokeWidth={3}

                        dot={{

                          r: 5,

                          fill: "#ffffff",

                          strokeWidth: 3,

                        }}

                        activeDot={{ r: 7 }}

                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>



                <div className="digital-chart-note">

                  <span>DATA VIEW</span>



                  <p>

                    선택한 지표의 주차별 변화를 표시합니다. 각 온라인 지표는

                    규모가 서로 다르므로 개별 그래프로 확인합니다.

                  </p>

                </div>

              </div>

            </section>

          )}



          {commentData &&

            commentData.keywords?.length > 0 &&

            commentData.sentiment && (

              <section className="comment-signal-section">

                <div className="comment-signal-heading">

                  <div>

                    <span className="section-label">COMMENT SIGNAL</span>



                    <h2>사람들은 무엇에 반응했을까?</h2>



                    <p>

                      댓글에서 자주 등장한 키워드와 감성 비율을 통해 주요 반응

                      포인트를 확인합니다.

                    </p>

                  </div>



                  <div className="comment-week">

                    <span>ANALYSIS WEEK</span>

                    <strong>{commentData.week}</strong>

                  </div>

                </div>



                <div className="comment-signal-grid">

                  <article className="keyword-card">

                    <div className="comment-card-header">

                      <div>

                        <span>TOP KEYWORDS</span>

                        <h3>🔎 댓글 주요 키워드</h3>

                      </div>



                      <small>TOP {commentData.keywords.length}</small>

                    </div>



                    <div className="keyword-list">

                      {commentData.keywords.map((item, index) => {

                        const maxCount =

                          Number(commentData.keywords[0]?.count) || 1;



                        const width = (Number(item.count) / maxCount) * 100;



                        return (

                          <div

                            className="keyword-row"

                            key={`${item.keyword}-${index}`}

                          >

                            <span className="keyword-rank">

                              {String(index + 1).padStart(2, "0")}

                            </span>



                            <strong className="keyword-name">

                              {item.keyword}

                            </strong>



                            <div className="keyword-bar-bg">

                              <div

                                className="keyword-bar"

                                style={{

                                  width: `${width}%`,

                                }}

                              ></div>

                            </div>



                            <span className="keyword-count">

                              {Number(item.count).toLocaleString()}

                            </span>

                          </div>

                        );

                      })}

                    </div>

                  </article>



                  <article className="sentiment-card">

                    <div className="comment-card-header">

                      <div>

                        <span>SENTIMENT</span>

                        <h3>☺ 댓글 감성</h3>

                      </div>



                      <small>긍정 / 부정</small>

                    </div>



                    <div className="sentiment-chart-wrap">

                      <div className="sentiment-chart">

                        <ResponsiveContainer width="100%" height={270}>

                          <PieChart>

                            <Pie

                              data={[

                                {

                                  name: "긍정",

                                  value: Number(

                                    commentData.sentiment.positive,

                                  ),

                                },

                                {

                                  name: "부정",

                                  value: Number(

                                    commentData.sentiment.negative,

                                  ),

                                },

                              ]}

                              cx="50%"

                              cy="50%"

                              innerRadius={75}

                              outerRadius={105}

                              paddingAngle={3}

                              dataKey="value"

                              stroke="none"

                            >

                              <Cell fill="#635bff" />

                              <Cell fill="#dedbea" />

                            </Pie>



                            <Tooltip

                              formatter={(value) => [`${value}%`, "비율"]}

                            />

                          </PieChart>

                        </ResponsiveContainer>



                        <div className="sentiment-center">

                          <span>긍정 반응</span>

                          <strong>{commentData.sentiment.positive}%</strong>

                          <p>댓글 감성</p>

                        </div>

                      </div>



                      <div className="sentiment-summary">

                        <div className="sentiment-item positive">

                          <div>

                            <i></i>

                            <span>긍정</span>

                          </div>



                          <strong>{commentData.sentiment.positive}%</strong>

                        </div>



                        <div className="sentiment-item negative">

                          <div>

                            <i></i>

                            <span>부정</span>

                          </div>



                          <strong>{commentData.sentiment.negative}%</strong>

                        </div>

                      </div>

                    </div>



                    <div className="sentiment-note">

                      <span>COMMENT DATA</span>



                      <p>

                        감성 비율은 댓글 반응의 분포를 보여주는 참고 지표이며

                        콘텐츠에 대한 전체 평가를 의미하지 않습니다.

                      </p>

                    </div>

                  </article>

                </div>



                {/* NEXT SIGNAL */}

                <div className="next-signal-grid">

                  {/* CREATIVE */}

                  <article className="next-signal-card creative-next-card">

                    <div className="next-signal-top">

                      <span>FROM SIGNAL TO IDEA</span>

                      <small>CREATIVE</small>

                    </div>



                    <h3>

                      이 반응은 어떤 콘텐츠로

                      <br />

                      확장할 수 있을까?

                    </h3>



                    <p>

                      주요 키워드와 반응 데이터를 기반으로 콘텐츠 기획

                      아이디어를 탐색합니다.

                    </p>



                    <button onClick={goToCreativeInsight}>

                      AI 기획 인사이트 보기

                      <span>→</span>

                    </button>

                  </article>



                  {/* BUSINESS */}

                  <article className="next-signal-card business-next-card">

                    <div className="next-signal-top">

                      <span>FROM SIGNAL TO BUSINESS</span>

                      <small>BUSINESS</small>

                    </div>



                    <h3>

                      이 콘텐츠의 비즈니스 신호를

                      <br />

                      살펴볼 수 있을까?

                    </h3>



                    <p>

                      시청자 타깃과 디지털 반응을 바탕으로 광고·협찬 관점의

                      검토 신호를 확인합니다.

                    </p>



                    <button onClick={goToBusinessInsight}>

                      비즈니스 신호 보기

                      <span>→</span>

                    </button>

                  </article>

                </div>

              </section>

            )}

        </section>

      )}

    </main>

    </div>

  );

}



export default Analysis;
