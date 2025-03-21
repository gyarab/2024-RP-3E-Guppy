import { useState } from "react";

interface AttendanceFormProps {
  eventName: string;
}

type AttendanceStatus = "attending" | "maybe" | "not_attending";

const AttendanceForm: React.FC<AttendanceFormProps> = ({ eventName }) => {
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | null>(
    null
  );

  return (
    <div className="attendance-form">
      <h2 className="event-title">{eventName}</h2>
      <div className="options">
        <button
          type="button"
          className={`option attending ${
            selectedStatus === "attending" ? "selected" : ""
          }`}
          onClick={() => setSelectedStatus("attending")}
        >
          ✅ Attending
        </button>
        <button
          type="button"
          className={`option maybe ${
            selectedStatus === "maybe" ? "selected" : ""
          }`}
          onClick={() => setSelectedStatus("maybe")}
        >
          🤔 Maybe
        </button>
        <button
          type="button"
          className={`option not-attending ${
            selectedStatus === "not_attending" ? "selected" : ""
          }`}
          onClick={() => setSelectedStatus("not_attending")}
        >
          ❌ Not Attending
        </button>
      </div>
    </div>
  );
};

export default AttendanceForm;
