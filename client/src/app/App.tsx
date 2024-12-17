import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import Router from "./routes/Router";
import Sidebar from "../widgets/Sidebar";

function App() {
  return (
    <>
      <Header />
      <Sidebar />
      <Router />
      <Footer />
    </>
  );
}

export default App;
