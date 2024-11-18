import { Link } from "react-router-dom";
import Logo from "../shared/ui/Logo";
import Nav from "../shared/ui/Nav";

function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="header__link">
          <Logo />
        </Link>
        <Nav />
        <div className="cta">
          <Link to="/login" className="btn">
            Login
          </Link>
          <Link to="/signup" className="btn btn--primary">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
