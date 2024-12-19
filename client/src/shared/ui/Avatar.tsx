type AvatarShape = "circle" | "rounded" | "square";

interface AvatarProps {
  src: string;
  text: string;
  secondaryText?: string;
  shape?: AvatarShape;
}

function Avatar({ src, text, secondaryText, shape }: AvatarProps) {
  return (
    <div className={`avatar avatar--${shape}`}>
      <img src={src} alt="Avatar image" className="avatar__img" />
      <div className="avatar__content">
        <h3 className="avatar__text">{text}</h3>
        {secondaryText && <p className="avatar__secondary">{secondaryText}</p>}
      </div>
    </div>
  );
}

export default Avatar;
