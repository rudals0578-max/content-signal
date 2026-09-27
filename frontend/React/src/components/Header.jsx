import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h1
        onClick={() => navigate("/")}
        className="header-logo"
      >
        CONTENT SIGNAL
      </h1>

      <nav>
        <NavLink
          to="/analysis"
          className={({ isActive }) =>
            isActive ? "nav-active" : ""
          }
        >
          콘텐츠 분석
        </NavLink>

        <NavLink
          to="/creative"
          className={({ isActive }) =>
            isActive ? "nav-active" : ""
          }
        >
          기획 인사이트
        </NavLink>

        <NavLink
          to="/business"
          className={({ isActive }) =>
            isActive ? "nav-active" : ""
          }
        >
          비즈니스
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;