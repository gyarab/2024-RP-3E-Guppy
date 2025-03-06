import { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";

import { isApiError } from "../shared/utils/helpers";
import { useForgotPasswordMutation } from "../features/auth/authApi";
import { ForgotPasswordCredentials } from "../shared/interfaces/ForgotPasswordCredentials";
import Button from "../shared/ui/Button";

const DEFAULT_CREDENTIALS: ForgotPasswordCredentials = {
  email: "",
};

function ForgotPasswordPage() {
  const [credentials, setCredentials] = useState(DEFAULT_CREDENTIALS);
  const [errorMessage, setErrorMessage] = useState("");

  const emailInputRef = useRef<HTMLInputElement>(null);

  const [forgotPassword, { isLoading, isSuccess }] =
    useForgotPasswordMutation();

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMessage("");
  }, [credentials]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await forgotPassword(credentials);

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
      <main className="forgotPassword">
        <div className="success-message">
          <div className="check-icon">
            <img src="/icons/check.svg" alt="Check icon" />
          </div>
          <p className="message">
            Success! A password reset email has been sent.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="forgotPassword">
      <div className="container forgotPassword__container">
        <h2 className="forgotPassword__title">Forgot Password</h2>
        <p className="forgotPassword__text">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="form forgotPassword__form">
          <div className="form__group">
            <input
              type="email"
              className="form__input"
              id="email"
              name="email"
              ref={emailInputRef}
              value={credentials.email}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            <span className="form__label-span">Email</span>
            <i></i>
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}

          <Button
            type="submit"
            variant="accent"
            additionalClasses="forgotPassword__button"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Email"}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
