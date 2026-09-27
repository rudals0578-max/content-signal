import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <Header />

      <main>
        {/* =========================
            HERO
        ========================== */}
        <section className="home-hero">
          <div className="home-hero-inner">
            {/* LEFT */}
            <div className="home-hero-content">
              <div className="home-eyebrow">
                <span className="eyebrow-dot"></span>
                DATA-DRIVEN CONTENT ANALYSIS
              </div>

              <h2 className="home-main-title">
                <span>데이터 속에서</span>

                <span>
                  다음 콘텐츠의 <strong>신호를 찾다</strong>
                </span>
              </h2>

              <p className="home-hero-description">
                시청률 · 타깃 · 디지털 반응 데이터를 함께 분석해
                <br />
                콘텐츠 안에 숨어 있는 가능성과 반응의 신호를 발견합니다.
              </p>

              <div className="home-hero-actions">
                <button
                  className="home-primary-btn"
                  onClick={() => navigate("/analysis")}
                >
                  콘텐츠 분석 시작하기
                  <span>→</span>
                </button>

                <span className="home-data-source">RACOI DATA · 2026</span>
              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="home-dashboard">
              <div className="dashboard-top">
                <div>
                  <span className="dashboard-label">CONTENT SIGNAL</span>

                  <strong>Data Overview</strong>
                </div>

                <div className="dashboard-status">
                  <span></span>
                  SIGNAL ON
                </div>
              </div>

              {/* DIGITAL */}
              <div className="dashboard-main-card">
                <div className="dashboard-card-title">
                  <div>
                    <span>DIGITAL REACTION</span>
                    <strong>반응 흐름</strong>
                  </div>

                  <span className="signal-badge">DIGITAL</span>
                </div>

                <div className="dashboard-chart">
                  <div style={{ height: "34%" }}></div>
                  <div style={{ height: "47%" }}></div>
                  <div style={{ height: "40%" }}></div>
                  <div style={{ height: "63%" }}></div>
                  <div style={{ height: "54%" }}></div>
                  <div style={{ height: "78%" }}></div>
                  <div style={{ height: "92%" }}></div>
                </div>

                <div className="dashboard-chart-labels">
                  <span>POST</span>
                  <span>COMMENT</span>
                  <span>VIDEO</span>
                </div>
              </div>

              {/* TARGET */}
              <div className="dashboard-bottom">
                <div className="target-card">
                  <span className="dashboard-label">TARGET SIGNAL</span>

                  <div className="target-row">
                    <span>10s</span>
                    <div>
                      <i style={{ width: "28%" }}></i>
                    </div>
                  </div>

                  <div className="target-row">
                    <span>20s</span>
                    <div>
                      <i style={{ width: "48%" }}></i>
                    </div>
                  </div>

                  <div className="target-row">
                    <span>30s</span>
                    <div>
                      <i style={{ width: "63%" }}></i>
                    </div>
                  </div>

                  <div className="target-row">
                    <span>40s</span>
                    <div>
                      <i style={{ width: "82%" }}></i>
                    </div>
                  </div>

                  <div className="target-row">
                    <span>50s</span>
                    <div>
                      <i style={{ width: "68%" }}></i>
                    </div>
                  </div>
                </div>

                <div className="signal-circle-card">
                  <span>SIGNAL</span>

                  <div className="signal-circle">
                    <div>
                      <strong>3</strong>
                      <span>VIEW</span>
                    </div>
                  </div>

                  <small>CONTENT · CREATIVE · BUSINESS</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            SERVICE SECTION
        ========================== */}
        <section className="home-service-section">
          <div className="home-service-heading">
            <div>
              <p>EXPLORE SIGNAL</p>

              <h3>
                하나의 데이터,
                <br />
                <strong>세 가지 관점</strong>
              </h3>
            </div>

            <p className="service-description">
              콘텐츠의 현재 반응을 분석하고,
              <br />
              다음 기획의 단서를 찾고,
              <br />
              비즈니스 검토 후보까지 연결합니다.
            </p>
          </div>

          <div className="home-service-grid">
            {/* CONTENT */}
            <Link to="/analysis" className="home-service-card">
              <div className="service-card-top">
                <span>01</span>
                <div className="service-arrow">↗</div>
              </div>

              <div className="service-icon content-icon">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <p>CONTENT SIGNAL</p>

              <h4>콘텐츠 분석</h4>

              <div className="service-line"></div>

              <span className="service-copy">
                시청률과 디지털 반응을 함께 비교해 콘텐츠의 주요 타깃과 상대적
                위치를 분석합니다.
              </span>
            </Link>

            {/* CREATIVE */}
            <Link to="/creative" className="home-service-card">
              <div className="service-card-top">
                <span>02</span>
                <div className="service-arrow">↗</div>
              </div>

              <div className="service-icon creative-icon">
                <i></i>
                <i></i>
                <i></i>
              </div>

              <p>CREATIVE SIGNAL</p>

              <h4>기획 인사이트</h4>

              <div className="service-line"></div>

              <span className="service-copy">
                디지털 반응과 연령별 데이터를 바탕으로 콘텐츠 기획에 참고할
                패턴과 후보를 탐색합니다.
              </span>
            </Link>

            {/* BUSINESS */}
            <Link to="/business" className="home-service-card">
              <div className="service-card-top">
                <span>03</span>
                <div className="service-arrow">↗</div>
              </div>

              <div className="service-icon business-icon">
                <div></div>
              </div>

              <p>BUSINESS SIGNAL</p>

              <h4>광고 · 협찬 검토</h4>

              <div className="service-line"></div>

              <span className="service-copy">
                목표 고객과 중요 지표를 설정해 광고·협찬 검토에 참고할 콘텐츠
                후보를 탐색합니다.
              </span>
            </Link>
          </div>
        </section>

        {/* =========================
            BOTTOM MESSAGE
        ========================== */}
        <section className="home-bottom-message">
          <p>CONTENT SIGNAL</p>

          <h3>
            높은 시청률만이
            <br />
            콘텐츠의 모든 가치를 설명할 수 있을까?
          </h3>

          <span>
            CONTENT SIGNAL은 하나의 지표가 아닌 여러 데이터 신호를 함께
            바라봅니다.
          </span>
        </section>
      </main>
    </div>
  );
}

export default Home;
