import { Link } from "react-router-dom";

import Logo from "../shared/ui/Logo";
import Nav from "../shared/ui/Nav";
import Button from "../shared/ui/Button";
import ThemeSwitch from "../shared/ui/ThemeSwitch";

function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="header__link">
          <Logo />
        </Link>
        <Nav />
        <div className="cta">
          <ThemeSwitch />
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
