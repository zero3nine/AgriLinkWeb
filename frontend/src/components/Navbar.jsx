import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload(); // <-- simple page refresh
  };

  return (
    <nav>
      {username ? (
        <>
          <span>Hello, {username}!</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/register"><button>Register</button></Link>
          <Link to="/login"><button>Login</button></Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
