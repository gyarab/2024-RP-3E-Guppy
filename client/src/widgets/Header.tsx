import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Logo from "../shared/ui/Logo";
import Nav from "../shared/ui/Nav";
import Button from "../shared/ui/Button";
import ThemeSwitch from "../shared/ui/ThemeSwitch";
import { selectIsAuth } from "../features/auth/authSlice";

function Header() {
  const isAuthenticated = useSelector(selectIsAuth);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="header__link">
          <Logo />
        </Link>
        <Nav isAuthenticated={isAuthenticated} />
        <div className="cta">
          <ThemeSwitch />
          {isAuthenticated ? (
            <Link to="/profile">
              <Button variant="accent">Your Profile</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="accent">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="accent">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
