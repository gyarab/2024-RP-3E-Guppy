import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";

import { AppDispatch } from "../app/store";
import { isApiError } from "../shared/utils/helpers";
import { useResetPasswordMutation } from "../features/auth/authApi";
import { setAuthCredentials } from "../features/auth/authSlice";
import { ResetPasswordCredentials } from "../shared/interfaces/ResetPasswordCredentials";
import EyeToggle from "../shared/ui/EyeToggle";
import Button from "../shared/ui/Button";


const DEFAULT_CREDENTIALS: ResetPasswordCredentials = {
  password: "",
  confirmPassword: "",
};

function ResetPasswordPage() {
  const [credentials, setCredentials] = useState(DEFAULT_CREDENTIALS);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);


  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, [credentials]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userData = await resetPassword(credentials).unwrap();
      dispatch(setAuthCredentials(userData));

      setCredentials(DEFAULT_CREDENTIALS);
      navigate("/");
    } catch (error) {
      if (isApiError(error)) {
        setErrorMessage(error.data.message);
      }
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
  function passwordCheck() {
    if (credentials.password !== credentials.confirmPassword) {
      setErrorMessage("Passwords do not match");
    }
  }

  return (
    <main className="resetPassword">
      <div className="container resetPassword__container">
        <h2 className="resetPassword__title">Reset your password</h2>
        <p className="resetPassword__text">
          Enter a new password and confirm it.
        </p>

        <form onSubmit={handleSubmit} className="form resetPassword__form">
          <div className="form__group">
            <input
              type={isVisible ? "text" : "password"}
              className="form__input"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              autoComplete="off"
              required
            /> <EyeToggle isVisible={isVisible} setIsVisible={setIsVisible} />
            <span className="form__label-span">Password</span>
            <i></i>
          </div>

          <div className="form__group">
            <input
              type={isVisible ? "text" : "password"}
              className="form__input"
              id="confirmPassword"
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={handleInputChange}
              autoComplete="off"
              required
            /> <EyeToggle isVisible={isVisible} setIsVisible={setIsVisible} />
            <span className="form__label-span">Confirm password</span>
            <i></i>
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}

          <Button
            type="submit"
            variant="accent"
            additionalClasses="resetPassword__button"
            disabled={isLoading}
            onClick={() => {
              passwordCheck();
            }}
          >
            {isLoading ? "Loading..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
