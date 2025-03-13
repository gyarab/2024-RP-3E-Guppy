import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { AppDispatch } from "../app/store";
import { isApiError } from "../shared/utils/helpers";
import { useSignupMutation } from "../features/auth/authApi";
import { setAuthCredentials } from "../features/auth/authSlice";
import { SignupCredentials } from "../shared/interfaces/SignupCredentials";
import EyeToggle from "../shared/ui/EyeToggle";
import Checkbox from "../shared/ui/Checkbox";
import Button from "../shared/ui/Button";

const DEFAULT_CREDENTIALS: SignupCredentials = {
  name: "",
  email: "",
  password: "",
};

function SignupPage() {
  const [credentials, setCredentials] = useState(DEFAULT_CREDENTIALS);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRemembered, setIsRemembered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [signup, { isLoading }] = useSignupMutation();

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMessage("");
  }, [credentials]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isRemembered) {
      setErrorMessage("You must agree to the terms and conditions");
      return;
    }

    try {
      const userData = await signup(credentials).unwrap();
      const { accessToken, ...payload } = userData;
      sessionStorage.setItem("accessToken", accessToken);
      dispatch(setAuthCredentials(payload));

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

  return (
    <main className="signup">
      <div className="container signup__container">
        <h2 className="signup__title">Join Us!</h2>
        <h3 className="section__subtitle">Create your account</h3>
        <p className="signup__text">
          Already have an account?{" "}
          <a href="/login" className="form__link">
            Login here!
          </a>
        </p>

        <form onSubmit={handleSubmit} className="form signup__form">
          <div className="form__group">
            <input
              type="text"
              className="form__input"
              id="name"
              name="name"
              value={credentials.name}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            <span className="form__label-span">Full name</span>
            <i></i>
          </div>

          <div className="form__group">
            <input
              type="email"
              className="form__input"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            <span className="form__label-span">Email</span>
            <i></i>
          </div>

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
            />
            <EyeToggle isVisible={isVisible} setIsVisible={setIsVisible} />
            <span className="form__label-span">Password</span>
            <i></i>
          </div>

          <div className="form__group--horizontal">
            <div className="form__group--checkbox">
              <Checkbox checked={isRemembered} setChecked={setIsRemembered} />
              <p>I agree to the terms and conditions</p>
            </div>
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}

          <Button
            type="submit"
            variant="accent"
            additionalClasses="signup__button"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default SignupPage;
