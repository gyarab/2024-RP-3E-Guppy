import { Link } from "react-router-dom";

function CreateOrgButton() {
  return (
    <Link to="/org/create" className="create-org">
      <span className="create-icon">+</span>
      <span className="create-text">Create</span>
    </Link>
  );
}

export default CreateOrgButton;
