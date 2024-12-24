import { Link } from "react-router-dom";

import { useNavigateWithParams } from "../shared/hooks/useNavigateParams";

// Mock Data
const organizations = [
  {
    id: 1,
    name: "Org 1",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
  },
  {
    id: 2,
    name: "Org 2",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
  },
  {
    id: 3,
    name: "Org 3",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
  },
  {
    id: 4,
    name: "Org 4",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
  },
  {
    id: 5,
    name: "Org 5",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
  },
  {
    id: 6,
    name: "Org 6",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
  },
  {
    id: 7,
    name: "Org 7",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
  },
];

const HomePage = () => {
  const navigateWithParams = useNavigateWithParams();

  const handleOrgClick = (orgId: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithParams("/org", { id: orgId.toString() });
  };

  return (
    <div className="container">
      <main className="main">
        <h1 className="main__title">Welcome to the Home Page</h1>
        <ul className="org-list">
          {organizations.map((org) => (
            <li
              key={org.id}
              className="org-list__item"
              onClick={handleOrgClick(org.id)}
            >
              <h3 className="org-list__title">{org.name}</h3>
              <p className="org-list__description">{org.description}</p>
            </li>
          ))}
          <li className="org-list__item org-list__item--create">
            <Link to="/org/create" className="org-list__link">
              <h3 className="org-list__title">Create your own organization</h3>
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
};

export default HomePage;
