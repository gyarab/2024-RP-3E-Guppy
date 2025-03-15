import { useEffect, useRef, useState } from "react";

import { extractColor } from "../utils/extractColor";
import Button from "./Button";
import { useJoinOrganizationMutation } from "../../features/organization/organizationApi";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { isApiError } from "../utils/helpers";

interface OrganizationCardProps {
  name?: string;
  description?: string;
  logo?: File | string | null;
  userJoined?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  simplified?: boolean;
}

function OrganizationCard({
  name,
  description,
  logo,
  userJoined,
  onClick,
  simplified,
}: OrganizationCardProps) {
  const [headerColor, setHeaderColor] = useState("#4a4a4a");
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);

  const navigate = useNavigate();
  const [joinOrganization, { isLoading }] = useJoinOrganizationMutation();

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

  useEffect(() => {
    setErrorMessage("");
  }, [code]);

  const handleChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);

    if (value && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleExtractColor = () => {
    const img = imgRef.current;
    if (!img) return;

    const color = extractColor(img);
    setHeaderColor(color);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setCode(["", "", "", "", "", ""]);
  };

  const handleJoin = async () => {
    try {
      const joinCode = code.join("");
      const data = await joinOrganization(joinCode).unwrap();
      sessionStorage.setItem("orgId", data.id.toString());

      navigate("/feed");
      setIsPopupOpen(false);
      setCode(["", "", "", "", "", ""]);
    } catch (error) {
      if (isApiError(error)) {
        setErrorMessage(error.data.message);
      }
    }
  };

  const imgSrc =
    objectUrl || (typeof logo === "string" ? logo : "/images/default-logo.png");

  return (
    <>
      {isLoading && <Loader />}
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
          {!simplified && (
            <>
              {userJoined ? (
                <p className="org-card__already-joined">Already Joined</p>
              ) : (
                <Button
                  variant="primary"
                  additionalClasses="org-card__join-btn"
                  onClick={() => setIsPopupOpen(true)}
                  noArrow
                >
                  Join
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      {isPopupOpen && (
        <div className="org-card__popup">
          <div className="org-card__popup-content">
            <img
              src={imgSrc}
              crossOrigin="anonymous"
              alt="Organization Icon"
              className="org-card__popup-icon"
            />
            <h4>Would like to join {name}?</h4>
            <div className="join-code-input-container">
              {code.map((char, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength={1}
                  className="join-code-input"
                  value={char}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
            {errorMessage && <p className="error-text">{errorMessage}</p>}
            <div className="org-card__popup-actions">
              <Button variant="secondary" onClick={handleClosePopup} noArrow>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleJoin}
                noArrow
                disabled={code.join("").length < 6}
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrganizationCard;
