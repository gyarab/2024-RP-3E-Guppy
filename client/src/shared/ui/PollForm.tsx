import { useState } from "react";

interface PollOption {
  id: number;
  name: string;
  votes: number;
}

const options: PollOption[] = [
  { id: 1, name: "Attending", votes: 0 },
  { id: 2, name: "Maybe", votes: 0 },
  { id: 3, name: "Not attending", votes: 0 },
];

interface PollFormProps {
  onClose?: () => void;
}

function PollForm({ onClose }: PollFormProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="poll-form">
      <h3 className="poll-title">Poll</h3>
      {onClose && (
        <button className="close-poll" onClick={onClose}>
          &times;
        </button>
      )}
      {options.map((option) => {
        const percentage = totalVotes ? (option.votes / totalVotes) * 100 : 0;
        return (
          <label key={option.id} className="poll-option">
            <input
              type="radio"
              name="poll"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => setSelectedOption(option.id)}
            />
            <div
              className="custom-radio"
              onChange={() => setSelectedOption(option.id)}
            ></div>
            <div className="option-info">
              <div className="option-details">
                <span className="option-name">{option.name}</span>
                <span className="percentage">{percentage.toFixed(0)}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}

export default PollForm;
