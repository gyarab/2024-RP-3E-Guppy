import { Link } from "react-router-dom";

function Nav() {
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
        <li className="nav__item">
          <Link to="/services" className="nav__link">
            Our services
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
