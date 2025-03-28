import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../shared/hooks/useDebounce";

import Button from "../shared/ui/Button";
import Loader from "../shared/ui/Loader";
import OrganizationCard from "../shared/ui/OrganizationCard";

import { truncate } from "../shared/utils/truncate";
import { imageUrl } from "../shared/utils/imageUrl";
import { formatFileSize } from "../shared/utils/formatFileSize";
import { extractColor } from "../shared/utils/extractColor";
import { useUploadImageMutation } from "../features/upload/uploadApi";
import {
  useCreateOrganizationMutation,
  useCheckOrgNameMutation,
} from "../features/organization/organizationApi";

function CreateOrganizationPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [nameAvailable, setNameAvailable] = useState<null | boolean>(null);
  const [logoColor, setLogoColor] = useState<string>("#4a4a4a");

  const debouncedName = useDebounce(name, 400);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadImage, { isLoading: isUploadLoading }] =
    useUploadImageMutation();
  const [createOrganization, { isLoading: isCreateLoading }] =
    useCreateOrganizationMutation();
  const [checkOrgName] = useCheckOrgNameMutation();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameAvailable(null);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogo(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const color = extractColor(img);
          setLogoColor(color);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      setLogoColor("#4a4a4a");
    }
  };

  useEffect(() => {
    if (!debouncedName.trim()) {
      setNameAvailable(null);
      return;
    }

    (async () => {
      try {
        const { data } = await checkOrgName(debouncedName);
        setNameAvailable(data?.available ?? null);
      } catch (error) {
        console.error("Error checking organization name:", error);
        setNameAvailable(null);
      }
    })();
  }, [debouncedName, checkOrgName]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nameAvailable !== true) return;

    try {
      let logoUrl = "/images/default-logo.png";
      if (logo) {
        const { data: url } = await uploadImage({
          file: logo,
          type: "organization",
        });
        logoUrl = imageUrl(url);
      }

      const response = await createOrganization({
        name,
        description,
        logoUrl,
        mainColor: logoColor,
      });

      if (response && response.data) {
        const orgId = response.data.id.toString();
        sessionStorage.setItem("orgId", orgId);
        navigate("/feed");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  return (
    <div className="container">
      {(isUploadLoading || isCreateLoading) && <Loader />}

      <h2 className="section__title">Create Your Own Organization</h2>
      <p className="section__subtitle">
        Fill in the form below to create your organization
      </p>

      <div className="create-org__container">
        <form className="form create-org__form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="name" className="form__label">
              Organization Name:
            </label>
            <input
              type="text"
              className="form__input"
              id="name"
              name="name"
              placeholder="e.g. Google"
              value={name}
              onChange={handleNameChange}
              required
            />
            {nameAvailable === false && (
              <span className="error-text">This name is already taken.</span>
            )}
            {nameAvailable === true && (
              <span className="success-text">This name is available!</span>
            )}
          </div>

          <div className="form__group">
            <label htmlFor="description" className="form__label">
              Description:
            </label>
            <textarea
              className="form__textarea"
              id="description"
              name="description"
              placeholder="e.g. Search Engine"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form__group">
            <label htmlFor="icon-file" className="form__label">
              Select Icon:
            </label>
            <Button
              additionalClasses="custom-file-upload"
              variant="primary"
              onClick={handleFileButtonClick}
              noArrow
            >
              <input
                type="file"
                className="form__input"
                id="icon-file"
                name="icon-file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
              />
              <span>
                {logo
                  ? truncate(logo.name, 25) + ` (${formatFileSize(logo.size)})`
                  : "Choose a file"}
              </span>
            </Button>
          </div>

          <Button
            type="submit"
            variant="accent"
            disabled={nameAvailable === false}
          >
            Create Organization
          </Button>
        </form>

        <OrganizationCard
          name={name}
          description={description}
          logo={logo}
          simplified
        />
      </div>
    </div>
  );
}

export default CreateOrganizationPage;
