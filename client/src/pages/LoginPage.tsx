import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useLoginMutation } from "../features/auth/authApi";
import { LoginCredentials } from "../shared/interfaces/LoginCredentials";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { setAuthCredentials } from "../features/auth/authSlice";
import Loader from "../shared/ui/Loader";
import { isApiError } from "../shared/utils/helpers";

const DEFAULT_CREDENTIALS: LoginCredentials = {
  email: "",
  password: "",
};

function LoginPage() {
  const [credentials, setCredentials] = useState(DEFAULT_CREDENTIALS);
  const [errMessage, setErrMessage] = useState("");

  const emailInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMessage("");
  }, [credentials]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userData = await login(credentials).unwrap();
      dispatch(setAuthCredentials(userData));

      setCredentials(DEFAULT_CREDENTIALS);
      navigate("/");
    } catch (error) {
      if (isApiError(error)) {
        setErrMessage(error.data.message);
      }
    }
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="section">
      <div className="container">
        <h2 className="section__title">Login page</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="email" className="form__label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form__input"
              ref={emailInputRef}
              value={credentials.email}
              onChange={handleFormChange}
            />
          </div>
          <div className="form__group">
            <label htmlFor="password" className="form__label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form__input"
              value={credentials.password}
              onChange={handleFormChange}
            />
          </div>
          <div className="form__group">
            <p className="form__error">{errMessage}</p>
          </div>
          <button type="submit" className="btn" disabled={isLoading}>
            Login
          </button>
        </form>
        {isLoading && <Loader />}
      </div>
    </section>
  );
}

export default LoginPage;
