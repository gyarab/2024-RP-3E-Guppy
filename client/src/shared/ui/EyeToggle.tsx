interface EyeToggleProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

function EyeToggle({ isVisible, setIsVisible }: EyeToggleProps) {
  return (
    <label className="eye-toggle__container">
      <input
        type="checkbox"
        checked={isVisible}
        onChange={() => setIsVisible(!isVisible)}
      />
      <svg viewBox="0 0 24 24" width="24" height="24">
        {isVisible ? (
          <path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        ) : (
          <>
            <path
              d="M17.94 17.94A10 10 0 0 1 12 20c-7 0-11-8-11-8a19.4 19.4 0 0 1 4.22-5.37"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M21 21L3 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </>
        )}
      </svg>
    </label>
  );
}

export default EyeToggle;
