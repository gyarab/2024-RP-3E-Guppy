import { Link, useLocation } from "react-router-dom";

interface NavProps {
  isAuthenticated?: boolean;
}

function Nav({ isAuthenticated = false }: NavProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "nav__link--active" : "";
  };

  return (
    <nav className="nav">
      <ul className="nav__list">
        <li className="nav__item">
          <Link to="/" className={`nav__link ${isActive("/")}`}>
            Home
          </Link>
        </li>
        <li className="nav__item">
          <Link to="/about" className={`nav__link ${isActive("/about")}`}>
            About
          </Link>
        </li>
        {isAuthenticated && (
          <>
            <li className="nav__item">
              <Link to="/feed" className={`nav__link ${isActive("/feed")}`}>
                Feed
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/orgs" className={`nav__link ${isActive("/orgs")}`}>
                Organizations
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/post/create" className={`nav__link ${isActive("/post/create")}`}>
                Create Post
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
