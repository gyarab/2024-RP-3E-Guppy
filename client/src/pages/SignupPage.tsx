import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { AppDispatch } from "../app/store";
import { isApiError } from "../shared/utils/helpers";
import { useSignupMutation } from "../features/auth/authApi";
import { setAuthCredentials } from "../features/auth/authSlice";
import { SignupCredentials } from "../shared/interfaces/SignupCredentials";
import Checkbox from "../shared/ui/Checkbox";
import Button from "../shared/ui/Button";

const DEFAULT_CREDENTIALS: SignupCredentials = {
  name: "",
  email: "",
  password: "",
  birthdate: "",
};

function SignupPage() {
  const [credentials, setCredentials] = useState(DEFAULT_CREDENTIALS);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRemembered, setIsRemembered] = useState(false);

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

    try {
      const userData = await signup(credentials).unwrap();
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

  function agreeToTerms() {
    if (isRemembered === false) {
      setErrorMessage("You must agree to the terms and conditions");
  }
}
  function minimumAge() {
    const today = new Date();
    const birthDate = new Date(credentials.birthdate);
    const age = today.getFullYear() - birthDate.getFullYear();

    if (birthDate > today) {
      setErrorMessage("You can't be born in the future");
    } else if (age < 15) {
      setErrorMessage("You must be at least 15 years old to sign up");
    } else if (age > 100) {
      setErrorMessage("Yeah, we know u ain't this old")
    }
  }

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
              type="password"
              className="form__input"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            <span className="form__label-span">Password</span>
            <i></i>
          </div>

          <div className="form__group">
            <input
              type="date"
              className="form__input"
              id="birthdate"
              name="birthdate"
              value={credentials.birthdate}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            <span className="form__label-span">Birthdate</span>
            <i></i>
          </div>

          <div className="form__group--horizontal">
            <div className="form__group--checkbox">
            <Checkbox 
              checked={isRemembered} 
              setChecked={setIsRemembered}
              />
              <p>I agree to the terms and conditions</p>
            </div>
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}

            <Button
            type="submit"
            variant="accent"
            additionalClasses="signup__button"
            disabled={isLoading}
            onClick={() => {
              agreeToTerms();
              minimumAge();
            }}
            >
            {isLoading ? "Loading..." : "Sign Up"}
            </Button>
        </form>
      </div>
    </main>
  );
}

export default SignupPage;
