import { useEffect, useRef, useState } from "react";

import { extractColor } from "../utils/extractColor";

interface OrganizationCardProps {
  name?: string;
  description?: string;
  logo?: File | string | null;
  onClick?: (e: React.MouseEvent) => void;
}

function OrganizationCard({
  name,
  description,
  logo,
  onClick,
}: OrganizationCardProps) {
  const [headerColor, setHeaderColor] = useState("#4a4a4a");
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      if (img.complete) {
        handleExtractColor();
      } else {
        img.onload = handleExtractColor;
      }
    }

    return () => {
      if (img) {
        img.onload = null;
      }
    };
  }, [objectUrl]);

  useEffect(() => {
    if (logo instanceof File) {
      const newObjectUrl = URL.createObjectURL(logo);
      setObjectUrl(newObjectUrl);

      return () => {
        URL.revokeObjectURL(newObjectUrl);
      };
    } else {
      setObjectUrl(null);
    }
  }, [logo]);

  const handleExtractColor = () => {
    const img = imgRef.current;
    if (!img) return;

    const color = extractColor(img);
    setHeaderColor(color);
  };

  const imgSrc =
    objectUrl || (typeof logo === "string" ? logo : "/images/default-logo.png");

  return (
    <div className="org-card" onClick={onClick}>
      <div
        className="org-card__header"
        style={{ backgroundColor: headerColor }}
      ></div>
      <div className="org-card__separator">
        <div className="org-card__icon">
          <img
            ref={imgRef}
            src={imgSrc}
            crossOrigin="anonymous"
            alt="Organization Icon"
          />
        </div>
      </div>
      <div className="org-card__body">
        <h4 className="org-card__name">{name || "Organization Name"}</h4>
        <p className="org-card__description">
          {description || "Some Description"}
        </p>
      </div>
    </div>
  );
}

export default OrganizationCard;
