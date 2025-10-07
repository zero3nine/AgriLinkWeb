import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.reload();
  };

  const handleLogoClick = () => {
    if (!role || role === "buyer") {
      navigate("/"); 
    } else if (role === "seller") {
      navigate("/seller-home");
    } else if (role === "delivery_provider") {
      navigate("/delivery-home");
    } else {
      navigate("/"); // fallback
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span onClick={handleLogoClick} className="navbar-logo" style={{ cursor: "pointer" }}>
          AgriLink
        </span>
      </div>
      <div className="navbar-right">
        {username ? (
          <>
            <span className="navbar-user">Hello, {username}!</span>
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn" onClick={() => navigate("/register")}>
              Register
            </button>
            <button className="btn" onClick={() => navigate("/login")}>
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
