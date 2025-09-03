
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.reload(); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">AgriLink</Link>
      </div>
      <div className="navbar-right">
        {username ? (
          <>
            <span className="navbar-user">Hello, {username}!</span>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/register"><button className="btn">Register</button></Link>
            <Link to="/login"><button className="btn">Login</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}


export default Navbar;
