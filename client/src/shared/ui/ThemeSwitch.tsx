import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../../app/store";
import { selectTheme, setTheme } from "../../features/ui/uiSlice";
import { themes } from "../constants/themes";

function ThemeSwitch() {
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
    <div
      role="button"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className={`theme-switch theme-switch--${theme}`}
      onClick={toggleTheme}
      tabIndex={0}
    >
      <span className="theme-switch__circle"></span>
      <span className="theme-switch__icon theme-switch__icon--sun"></span>
      <span className="theme-switch__icon theme-switch__icon--moon"></span>
    </div>
  );
}

export default ThemeSwitch;
