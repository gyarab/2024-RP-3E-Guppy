import logoIcon from "../../app/assets/icons/logo.svg";

function Logo() {
  return (
    <h1 className="logo">
      <img src={logoIcon} alt="Logo" className="logo__icon" />
      <span className="logo__text">BEER</span>
    </h1>
  );
}

export default Logo;
