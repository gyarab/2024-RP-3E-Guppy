import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from "../app/store";
import { selectUser, logout } from "../features/auth/authSlice";
import Button from "../shared/ui/Button";
import Avatar from "../shared/ui/Avatar";

function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    const user = useSelector(selectUser);
    const birthdate = user?.birthdate ? new Date(user.birthdate) : null;
    const formattedBirthdate = birthdate ? birthdate.toDateString() : "N/A";

    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();


    console.log(user);

    function changePassword() {
        navigate("/forgot-password");
    }
    function isUndefined(message: string, value: string | undefined) {
        if (value === undefined){
        return message;
        } else {return value};
    }
    /*function isOwner() {
        if (user.id === "owner") {
            return true;
        } else {
            return false;
        }
    }*/
   function toggleEdit() {
        setIsEditing(!isEditing);
    }
    return (
        <main className="profile">
            <h1 className="section__title">Your profile</h1>
            <div className="container profile__container">
                <div className="profile__preview">
                    <Avatar 
                       src={isUndefined("https://placehold.co/50", user?.profilePictureUrl)}
                    />
                    <div className="profile__info">
                        <h2 className="section__subtitle">{user?.name}</h2>
                        <span className="">{user?.email}</span>
                    </div>
                    <Button 
                            additionalClasses="editProfile__button button" 
                            variant="accent"
                            onClick={toggleEdit}>
                            {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                </div>
                    <div className="form__group">
                        <input
                            type="text"
                            id="name"
                            className="form__input" 
                            defaultValue={user?.name} 
                            readOnly = {!isEditing}
                        />
                        <span className="form__label-span">Full name</span>
                        <i></i>
                    </div>
                    <div className="form__group">
                        <input 
                            type="text" 
                            id="bio"
                            className="form__input" 
                            defaultValue={user?.bio} //isUndefined("Enter Bio", user?.bio)
                            readOnly = {!isEditing}
                        />
                        <span className="form__label-span">Bio</span>
                        <i></i>
                    </div>
                    <div className="form__group">
                        <input 
                            type="email" 
                            id="email"
                            className="form__input" 
                            defaultValue={user?.email} 
                            readOnly = {!isEditing}
                        />
                        <span className="form__label-span">Email</span>
                        <i></i>
                    </div>
                    <div className="form__group">
                        <input
                            type="tel" 
                            id="phone"
                            className="form__input" 
                            defaultValue={user?.phoneNumber} //isUndefined("Enter Phone", user?.phoneNumber)
                            readOnly = {!isEditing}
                        />
                        <span className="form__label-span">Phone</span>
                        <i></i>
                    </div>
                    <div className="form__group">
                        <input 
                            type="date" 
                            id="birthdate"
                            className="form__input" 
                            defaultValue={formattedBirthdate} 
                            readOnly = {!isEditing}
                        />
                        <span className="form__label-span">Birthdate</span>
                        <i></i>
                    </div>
                    <div className="bottom__buttons">
                    <Button 
                        additionalClasses="changePassword__button button" 
                        variant="accent"
                        onClick={changePassword}
                        >Change Password
                    </Button>
                    <Button 
                        additionalClasses="logout__button button" 
                        onClick={() => logout /*dispatch(logout)*/}>
                        Logout
                    </Button>
                    </div>
            </div>
        </main>
    );
}

export default ProfilePage;