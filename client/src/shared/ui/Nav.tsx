import { Link } from "react-router-dom";

interface NavProps {
  isAuthenticated?: boolean;
}

function Nav({ isAuthenticated = false }: NavProps) {
  return (
    <nav className="nav">
      <ul className="nav__list">
        <li className="nav__item">
          <Link to="/" className="nav__link">
            Home
          </Link>
        </li>
        <li className="nav__item">
          <Link to="/about" className="nav__link">
            About
          </Link>
        </li>
        {isAuthenticated && (
          <>
            <li className="nav__item">
              <Link to="/feed" className="nav__link">
                Feed
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/post/create" className="nav__link">
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
