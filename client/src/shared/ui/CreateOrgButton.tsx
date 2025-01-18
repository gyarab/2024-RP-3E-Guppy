import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

function CreateOrgButton() {
  const isSidebarOpen = useSelector((state: RootState) => state.ui.isSidebarOpen);

  const spanClass = isSidebarOpen ? "" : "create-text-closed";

  return (
    <Link
        to="/"
        className="create-org"
      >
        <span className="create-icon">+</span>
        <span className={`${spanClass} create-text`}>Create</span>
      </Link>
  );
}

export default CreateOrgButton;
