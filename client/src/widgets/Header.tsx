import { Link } from "react-router-dom";

import { useAuth } from "../shared/hooks/useAuth";
import { useShowElements } from "../shared/hooks/useShowElements";

import Logo from "../shared/ui/Logo";
import Nav from "../shared/ui/Nav";
import Button from "../shared/ui/Button";
import ToggleSidebar from "../shared/ui/ToggleSidebar";
import ThemeSwitch from "../shared/ui/ThemeSwitch";

function Header() {
  const { isAuth } = useAuth();

  const { showSidebar } = useShowElements();

  return (
    <header className="header">
      <div className="header__container">
        <div className="cta">
          {showSidebar && <ToggleSidebar />}
          <Link to="/" className="header__link">
            <Logo />
          </Link>
        </div>
        <Nav isAuthenticated={isAuth} />
        <div className="cta">
          <ThemeSwitch />
          {isAuth ? (
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
