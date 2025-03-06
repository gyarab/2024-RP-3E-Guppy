import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from "../app/store";
import { selectUser, logout } from "../features/auth/authSlice";

import Button from "../shared/ui/Button";
import Avatar from "../shared/ui/Avatar";
import { User } from "../shared/interfaces/User";
import Loader from "../shared/ui/Loader";

function ProfilePage() {
  const user = useSelector(selectUser);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  if (formData === null) {
    return <Loader />;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // dispatch(updateUser(formData));
    setIsEditing(false);
  };

  const handleLogout = () => {
    // dispatch(logout());
    // navigate("/login");
  };

  return (
    <div className="container">
      <h1 className="section__title">Profile</h1>
      <div className="profile">
        <div className="profile__header">
          <Avatar
            src={formData.profilePictureUrl || "https://placehold.co/100"}
            text={formData.name}
            secondaryText={formData.email}
          />
          {isEditing ? (
            <div className="profile__actions">
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="profile__actions">
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="profile__form">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
            />
            <input
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate.toISOString().split("T")[0]}
              onChange={handleChange}
            />
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
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
