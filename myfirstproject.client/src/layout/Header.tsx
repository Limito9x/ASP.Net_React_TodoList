import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  return (
    <header>
      <h1>My First Project</h1>
      <div>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
          </ul>
        </nav>
        {userInfo ? (
          <div id="user-info">
            <span>Welcome, {userInfo.fullName}!</span>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div id="auth-actions">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </div>
        )}
      </div>
    </header>
  );
}
