function Loader() {
  return (
    <div className="loader">
      <div className="loader__spinner">
        <svg viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" />
        </svg>
      </div>
    </div>
  );
}

export default Loader;
