import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { AppDispatch } from "../app/store";
import { isApiError } from "../shared/utils/helpers";
import { useLoginMutation } from "../features/auth/authApi";
import { setAuthCredentials } from "../features/auth/authSlice";
import { LoginCredentials } from "../shared/interfaces/LoginCredentials";
import EyeToggle from "../shared/ui/EyeToggle";
import Checkbox from "../shared/ui/Checkbox";
import Button from "../shared/ui/Button";

const DEFAULT_CREDENTIALS: LoginCredentials = {
  email: "",
  password: "",
};

function LoginPage() {
  const [credentials, setCredentials] = useState(DEFAULT_CREDENTIALS);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRemembered, setIsRemembered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMessage("");
  }, [credentials]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userData = await login(credentials).unwrap();
      // dispatch(setAuthCredentials(userData));
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
  function rememberMe() {
    if (isRemembered === true) {
      //remember credentials
    } else {
      //forget credentials
    }
  }

  return (
    <main className="login">
      <div className="container login__container">
        <h2 className="login__title">Welcome!</h2>
        <h3 className="section__subtitle">Login to use our services</h3>
        <p className="login__text">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="form__link">
            Sign up here!
          </a>
        </p>

        <form onSubmit={handleSubmit} className="form login__form">
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
            />  <EyeToggle isVisible={isVisible} setIsVisible={setIsVisible} />
            <span className="form__label-span">Password</span>
            <i></i>
          </div>

          <div className="form__group--horizontal">
            <div className="form__group--checkbox">
              <Checkbox checked={isRemembered} setChecked={setIsRemembered} />
              <p>Remember me</p>
            </div>
            <a href="/ForgotPassword" className="form__link">
              Forgot password?
            </a>
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}

          <Button
            type="submit"
            variant="accent"
            additionalClasses="login__button"
            disabled={isLoading}
            onClick={rememberMe}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
