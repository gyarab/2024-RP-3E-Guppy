import { FormEvent, useEffect, useRef, useState } from "react";
import useDebounce from "../shared/hooks/useDebounce";

import Button from "../shared/ui/Button";
import Loader from "../shared/ui/Loader";
import OrganizationCard from "../shared/ui/OrganizationCard";

import { truncate } from "../shared/utils/truncate";
import { formatFileSize } from "../shared/utils/formatFileSize";
import { useUploadImageMutation } from "../features/upload/uploadApi";
import {
  useCreateOrganizationMutation,
  useCheckOrgNameMutation,
} from "../features/organization/organizationApi";

function CreateOrganizationPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [nameAvailable, setNameAvailable] = useState<null | boolean>(null);

  const debouncedName = useDebounce(name, 400);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadImage, { isLoading: isUploadLoading }] =
    useUploadImageMutation();
  const [createOrganization, { isLoading: isCreateLoading }] =
    useCreateOrganizationMutation();
  const [checkOrgName] = useCheckOrgNameMutation();

  /** Handle organization name change */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameAvailable(null);
  };

  /** Handle file input click */
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  /** Handle file selection */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogo(e.target.files?.[0] || null);
  };

  /** Check organization name availability */
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

  /** Handle form submission */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!logo || nameAvailable === false) return;

    try {
      const { data: url } = await uploadImage({
        file: logo,
        type: "organization",
      });
      if (!url) return;

      await createOrganization({ name, description, logoUrl: url });
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

        <OrganizationCard name={name} description={description} logo={logo} />
      </div>
    </div>
  );
}

export default CreateOrganizationPage;
