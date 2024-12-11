function Logo() {
  return (
    <h1 className="logo">
      <img src="/icons/logo.svg" alt="Logo" className="logo__icon" />
      <div className="logo__text">
        <span className="actual-text">&nbsp;Guppy&nbsp;</span>
        <span aria-hidden="true" className="hover-text">
          &nbsp;Guppy&nbsp;
        </span>
      </div>
    </h1>
  );
}

export default Logo;
