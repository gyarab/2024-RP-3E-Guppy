import { useState } from "react";

function Checkbox() {
  const [checked, setChecked] = useState(false);

  return (
    <label className="checkbox__container">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <svg viewBox="0 0 64 64">
        <path
          d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
          pathLength="575.0541381835938"
          style={{
            strokeDasharray: checked
              ? "70.5096664428711 9999999"
              : "241 9999999",
            strokeDashoffset: checked ? "-262.2723388671875" : 0,
          }}
        ></path>
      </svg>
    </label>
  );
}

export default Checkbox;
