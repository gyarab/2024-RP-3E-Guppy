import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { AppDispatch } from "./store";
import { setIsAuth } from "../features/auth/authSlice";
import { useVerifyQuery } from "../features/auth/authApi";

import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import Router from "./routes/Router";
import Loader from "../shared/ui/Loader";
import Sidebar from "../widgets/Sidebar";
import Aside from "../shared/ui/Aside";

function App() {
  const { data, isLoading, isFetching } = useVerifyQuery();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (data) {
      console.log("Authenticated user:", data);
      dispatch(setIsAuth(data.isAuth));
    }
  }, [data, dispatch]);

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <div className="page-container">
      <Header />
      <Sidebar />
      <Router isAuthenticated={!!data?.isAuth} />
      <Aside />
      <Footer />
    </div>
  );
}

export default App;
