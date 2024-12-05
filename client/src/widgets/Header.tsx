import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../app/store";
import { selectTheme, setTheme } from "../features/ui/uiSlice";
import Logo from "../shared/ui/Logo";
import Nav from "../shared/ui/Nav";
import Button from "../shared/ui/Button";
import { themes } from "../shared/constants/themes";

function Header() {
  const dispatch: AppDispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    dispatch(setTheme(themes[nextIndex]));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="header__link">
          <Logo />
        </Link>
        <Nav />
        <div className="cta">
          <Button onClick={toggleTheme} variant="primary">
            Toggle Theme
          </Button>
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
