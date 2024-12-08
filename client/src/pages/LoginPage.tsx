import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { AppDispatch } from "../app/store";
import { isApiError } from "../shared/utils/helpers";
import { useLoginMutation } from "../features/auth/authApi";
import { setAuthCredentials } from "../features/auth/authSlice";
import { LoginCredentials } from "../shared/interfaces/LoginCredentials";

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
    <div className="container">
      <h2 className="section__title">Login page</h2>
    </div>
  );
}

export default LoginPage;
