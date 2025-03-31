import { useState } from "react";
import { PollOption } from "../interfaces/Post";

interface CreatePollProps {
  onPollCreate: (options: PollOption[]) => void;
}

function CreatePoll({ onPollCreate }: CreatePollProps) {
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: 1, name: "", votes: 0 },
  ]);
  const [isEditing, setIsEditing] = useState(true);

  const addOption = () => {
    setPollOptions([...pollOptions, { id: Date.now(), name: "", votes: 0 }]);
  };

  const updateOption = (index: number, newName: string) => {
    setPollOptions((prev) =>
      prev.map((option, i) =>
        i === index ? { ...option, name: newName } : option
      )
    );
  };

  const removeOption = (index: number) => {
    setPollOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const submitPoll = () => {
    if (pollOptions.some((opt) => !opt.name.trim())) {
      alert("Event name and options must not be empty!");
      return;
    }
    setIsEditing(false);
    onPollCreate(pollOptions);
  };

  return (
    <div className="create-poll">
      <h4>Poll Options</h4>
      {pollOptions.map((option, index) => (
        <div key={option.id} className="create-poll__group">
          <input
            type="text"
            className="create-poll__input"
            placeholder="Option"
            value={option.name}
            onChange={(e) => updateOption(index, e.target.value)}
            disabled={!isEditing}
          />
          {isEditing && (
            <button
              className="btn create-poll__remove-btn"
              onClick={() => removeOption(index)}
            >
              <svg viewBox="0 0 448 512">
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
              </svg>
            </button>
          )}
        </div>
      ))}
      <div className="create-poll__actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="btn create-poll__btn"
              onClick={addOption}
            >
              Add Option
            </button>
            <button
              type="button"
              className="btn create-poll__btn"
              onClick={submitPoll}
            >
              Create Poll
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn create-poll__btn"
            onClick={() => setIsEditing(true)}
          >
            Update Poll
          </button>
        )}
      </div>
    </div>
  );
}

export default CreatePoll;
