import { useState, ChangeEvent, FormEvent, useEffect } from "react";

import { isApiError } from "../shared/utils/helpers";
import { useResetPasswordMutation } from "../features/auth/authApi";
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
  const [token, setToken] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

  useEffect(() => {
    setErrorMessage("");
  }, [credentials]);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setErrorMessage("Invalid reset password link");
    }

    setToken(token || "");
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmPassword) {
      setErrorMessage("Passwords do not match");
    }

    if (!token) {
      setErrorMessage("Invalid reset password link. Please try again.");
    }

    try {
      await resetPassword({ newPassword: credentials.password, token });

      setCredentials(DEFAULT_CREDENTIALS);
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

  if (isSuccess) {
    return (
      <main className="resetPassword">
        <div className="success-message">
          <div className="check-icon">
            <img src="/icons/check.svg" alt="Check icon" />
          </div>
          <p className="message">
            Success! Your password has been reset. You can now log in with your
            new password.
          </p>
        </div>
      </main>
    );
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
            />{" "}
            <EyeToggle isVisible={isVisible} setIsVisible={setIsVisible} />
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
            />{" "}
            <EyeToggle isVisible={isVisible} setIsVisible={setIsVisible} />
            <span className="form__label-span">Confirm password</span>
            <i></i>
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}

          <Button
            type="submit"
            variant="accent"
            additionalClasses="resetPassword__button"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
