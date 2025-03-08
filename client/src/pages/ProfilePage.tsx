import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from "../app/store";
import {
  selectUser,
  logout,
  setAuthCredentials,
} from "../features/auth/authSlice";

import Button from "../shared/ui/Button";
import Avatar from "../shared/ui/Avatar";
import { User } from "../shared/interfaces/User";
import Loader from "../shared/ui/Loader";
import { useLogoutMutation } from "../features/auth/authApi";
import { useUpdateProfileMutation } from "../features/user/userApi";
import { useUploadImageMutation } from "../features/upload/uploadApi";

function ProfilePage() {
  const user = useSelector(selectUser);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [logoutApi, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const [updateProfile, { isLoading: isUpdateLoading }] =
    useUpdateProfileMutation();
  const [uploadImage, { isLoading: isUploadLoading }] =
    useUploadImageMutation();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  if (formData === null) {
    return <Loader />;
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
          ...formData,
          profilePictureUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    if (e.target.name === "birthdate") {
      setFormData({
        ...formData,
        [e.target.name]: new Date(e.target.value),
      });
      return;
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name) {
      setErrorMessage("Name is required");
      return;
    }

    const formDataCopy = { ...formData };

    if (selectedFile) {
      const { data: url } = await uploadImage({
        file: selectedFile,
        type: "user",
      });

      if (!url) {
        setErrorMessage("Failed to upload image");
        return;
      }

      formDataCopy.profilePictureUrl = `http://localhost:3000/${url}`;
    }

    const userData = await updateProfile(formDataCopy).unwrap();
    const { accessToken, ...payload } = userData;
    sessionStorage.setItem("accessToken", accessToken);

    dispatch(setAuthCredentials(payload));
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logoutApi();
    sessionStorage.removeItem("accessToken");
    dispatch(logout());
    navigate("/login");
  };

  const handleCancelEdit = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="container">
      {(isLogoutLoading || isUpdateLoading || isUploadLoading) && <Loader />}
      <h1 className="section__title">Profile</h1>
      <div className="profile">
        <div className="profile__header">
          {isEditing ? (
            <div className="profile-picture-editor">
              <div className="profile-picture__preview">
                <img
                  src={formData.profilePictureUrl || "https://placehold.co/100"}
                  alt="Profile Preview"
                />
                <div className="profile-picture__overlay">
                  <label htmlFor="profileUpload">
                    <img src="/icons/pencil.svg" alt="Pencil icon" />
                  </label>
                </div>
              </div>
              <div className="profile-picture__details">
                <p>Upload a picture</p>
                <p>Recommended size: 100x100px</p>
              </div>
              <input
                type="file"
                id="profileUpload"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                hidden
              />
            </div>
          ) : (
            <Avatar
              src={formData.profilePictureUrl || "https://placehold.co/100"}
              text={formData.name}
              secondaryText={formData.email}
            />
          )}
          {isEditing ? (
            <div className="profile__actions">
              <Button variant="primary" onClick={handleSave} noArrow>
                Save Changes
              </Button>
              <Button variant="secondary" onClick={handleCancelEdit} noArrow>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="profile__actions">
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
                noArrow
              >
                Edit Profile
              </Button>
            </div>
          )}
        </div>
        {isEditing ? (
          <form className="profile__form">
            <div className="form__group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                className="form__input"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="bio">Bio</label>
              <input
                type="text"
                className="form__input"
                id="bio"
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                autoComplete="off"
                placeholder="Add a bio"
              />
            </div>

            <div className="form__group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                className="form__input"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                autoComplete="off"
                placeholder="Add a phone number"
              />
            </div>

            <div className="form__group">
              <label htmlFor="birthdate">Birthdate</label>
              <input
                type="date"
                className="form__input"
                id="birthdate"
                name="birthdate"
                value={
                  formData.birthdate
                    ? formData.birthdate.toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
              />
            </div>
          </form>
        ) : (
          <div className="profile__details">
            <div className="profile__detail">
              <h3 className="profile__detail__label">Full Name</h3>
              <p className="profile__detail__text">{formData.name}</p>
            </div>
            <div className="profile__detail">
              <h3 className="profile__detail__label">Bio</h3>
              <p className="profile__detail__text">
                {formData.bio || "No bio provided"}
              </p>
            </div>
            <div className="profile__detail">
              <h3 className="profile__detail__label">Phone Number</h3>
              <p className="profile__detail__text">
                {formData.phoneNumber || "No phone number"}
              </p>
            </div>
            <div className="profile__detail">
              <h3 className="profile__detail__label">Birthdate</h3>
              <p className="profile__detail__text">
                {formData.birthdate
                  ? new Date(formData.birthdate).toDateString()
                  : "No birthdate"}
              </p>
            </div>
            <div className="profile__detail">
              <h3 className="profile__detail__label">Last Login</h3>
              <p className="profile__detail__text">
                {formData.lastLogin
                  ? new Date(formData.lastLogin).toDateString()
                  : "No login date"}
              </p>
            </div>
            <div className="profile__detail">
              <h3 className="profile__detail__label">Verification Status</h3>
              <p className="profile__detail__text">
                {formData.isVerified ? "Verified" : "Not Verified"}
              </p>
            </div>
          </div>
        )}

        {errorMessage && <p className="error">{errorMessage}</p>}

        <div className="profile__actions">
          <Button variant="accent">
            <Link to="/forgot-password">Forgot Password</Link>
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
