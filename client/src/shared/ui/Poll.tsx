import { useState } from "react";

import Button from "./Button";

import { Poll as IPoll, PollOption } from "../interfaces/Post";

interface PollProps {
  poll: IPoll;
  onVote: (optionId: number) => void;
  onRemoveVote?: () => void;
}

function Poll({ poll, onVote, onRemoveVote }: PollProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    poll.userVote || null
  );
  const [pollOptions, setPollOptions] = useState<PollOption[]>(poll.options);
  const [totalVotes, setTotalVotes] = useState(
    poll.options.reduce((sum, option) => sum + option.votes, 0)
  );

  const handleVote = (optionId: number) => {
    if (selectedOption === optionId) return;

    setPollOptions((prevOptions) =>
      prevOptions.map((option) => {
        if (option.id === selectedOption) {
          return { ...option, votes: Math.max(0, option.votes - 1) };
        }
        if (option.id === optionId) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      })
    );

    if (!selectedOption) {
      setTotalVotes((prevTotal) => prevTotal + 1);
    }

    setSelectedOption(optionId);
    onVote(optionId);
  };

  const handleRemoveVote = () => {
    if (!selectedOption) return;

    setPollOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === selectedOption && option.votes > 0
          ? { ...option, votes: option.votes - 1 }
          : option
      )
    );

    setTotalVotes((prevTotal) => (prevTotal > 0 ? prevTotal - 1 : 0));
    setSelectedOption(null);
    onRemoveVote?.();
  };

  return (
    <div className="poll-form">
      <h3 className="poll-title">Poll</h3>
      {pollOptions.map((option) => {
        const percentage = totalVotes ? (option.votes / totalVotes) * 100 : 0;
        return (
          <label key={option.id} className="poll-option">
            <input
              type="radio"
              name={`poll-${poll.id}`}
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => handleVote(option.id)}
            />
            <div className="custom-radio"></div>
            <div className="option-info">
              <div className="option-details">
                <span className="option-name">{option.name}</span>
                <span className="percentage">
                  {option.votes} ({percentage.toFixed(0)}%)
                </span>
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
      {selectedOption && onRemoveVote && (
        <Button
          variant="basic"
          additionalClasses="vote-button"
          onClick={handleRemoveVote}
        >
          Remove vote
        </Button>
      )}
    </div>
  );
}

export default Poll;
