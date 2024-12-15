interface AvatarProps {
  image: string;
  text: string;
  secondaryText?: string;
}

function Avatar({ image, text, secondaryText }: AvatarProps) {
  return (
    <div className="avatar">
      <img src={image} alt="Avatar image" className="avatar__img" />
      <div className="avatar__info">
        <h3 className="avatar__name">{text}</h3>
        {secondaryText && <p className="avatar__secondary">{secondaryText}</p>}
      </div>
    </div>
  );
}

export default Avatar;
