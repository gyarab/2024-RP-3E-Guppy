function Loader() {
  return (
    // <div className="loader">
    //   <div className="loader__spinner">
    //     <svg viewBox="0 0 50 50">
    //       <circle cx="25" cy="25" r="20" />
    //     </svg>
    //   </div>
    // </div>
    <div className="loader__container">
      <div className="loader">
        <div className="cell d-0"></div>
        <div className="cell d-1"></div>
        <div className="cell d-2"></div>

        <div className="cell d-1"></div>
        <div className="cell d-2"></div>

        <div className="cell d-2"></div>
        <div className="cell d-3"></div>

        <div className="cell d-3"></div>
        <div className="cell d-4"></div>
      </div>
    </div>
  );
}

export default Loader;
