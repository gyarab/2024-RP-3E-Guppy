type AvatarShape = "circle" | "rounded" | "square";

interface AvatarProps {
  src: string;
  text?: string;
  secondaryText?: string;
  shape?: AvatarShape;
  onClick?: () => void;
}

function Avatar({
  src,
  text,
  secondaryText,
  shape = "circle",
  onClick,
}: AvatarProps) {
  return (
    <div className={`avatar avatar--${shape}`} onClick={onClick}>
      <img src={src} alt="Avatar image" className="avatar__img" />
      <div className="avatar__content">
        {text && <h3 className="avatar__text">{text}</h3>}
        {secondaryText && <p className="avatar__secondary">{secondaryText}</p>}
      </div>
    </div>
  );
}

export default Avatar;
