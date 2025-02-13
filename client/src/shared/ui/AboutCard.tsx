interface CardProps {
  header: string;
  text: string;
  iconPath: string;
}

const Card = ({header, text, iconPath}: CardProps) => {
  return (
    <div className="card sweeperCard o-hidden">
      <div className="containers">
        <div className="icon">
          <svg
            width="28"
            height="29"
            viewBox="0 0 28 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.7222 9.04435V6.71102C23.7222 5.42235 22.6775 4.37769 21.3888 4.37769L6.61106 4.37769C5.32239 4.37769 4.27773 5.42235 4.27773 6.71102V9.04435C4.27773 10.333 5.32239 11.3777 6.61106 11.3777H21.3888C22.6775 11.3777 23.7222 10.333 23.7222 9.04435Z"
              stroke="#23C55E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M23.7222 21.4888V19.1555C23.7222 17.8668 22.6775 16.8221 21.3888 16.8221H15.9444C14.6557 16.8221 13.6111 17.8668 13.6111 19.1555V21.4888C13.6111 22.7775 14.6557 23.8221 15.9444 23.8221H21.3888C22.6775 23.8221 23.7222 22.7775 23.7222 21.4888Z"
              stroke="#23C55E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
        <div className="title my-3">{header}</div>
        <div className="subtitle">
          {text}
        </div>
      </div>
    </div>
  );
};

export default Card;
