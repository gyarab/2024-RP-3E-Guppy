import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from "../app/store";
import { selectUser, logout } from "../features/auth/authSlice";
import Button from "../shared/ui/Button";
import Avatar from "../shared/ui/Avatar";

function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [dateValue, setDateValue] = useState("");

    const user = useSelector(selectUser);
    const birthdate = user?.birthdate ? new Date(user.birthdate) : new Date();
    const formattedBirthdate = birthdate.toISOString().split("T")[0];

    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();

    console.log("Bday: " + user?.birthdate);
    console.log("formatted bday: " + formattedBirthdate);

    useEffect(() => {
        if (formattedBirthdate) {
            setDateValue(formattedBirthdate);
        }
    }, [formattedBirthdate]); 

    function isUndefined(message: string, value: string | undefined) {
        if (value === undefined){
        return message;
        } else {return value};
    }
    /*function isOwner() {
        if ({user?.id} === {profile?.id}) {
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
                            value={dateValue} 
                            onChange={(e) => setDateValue(e.target.value)} // Allows editing
                            readOnly = {!isEditing}
                        />
                        <span className="form__label-span">Birthdate</span>
                        <i></i>
                    </div>
                    <div className="bottom__buttons">
                    <Button 
                        additionalClasses="changePassword__button button" 
                        variant="accent"
                        onClick={() => navigate("/forgot-password")}
                        >Change Password
                    </Button>
                    <Button 
                        additionalClasses="logout__button button" 
                        onClick={() => {
                            dispatch(logout());
                            navigate("/login");
                        }}>
                        Logout
                    </Button>
                    </div>
            </div>
        </main>
    );
}

export default ProfilePage;