import { Link } from "react-router-dom";

import { useNavigateWithParams } from "../shared/hooks/useNavigateParams";
import Post from "../shared/ui/post/Post";
import CreatePostForm from "../shared/ui/post/CreatePostForm";

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
];

const HomePage = () => {
  const navigateWithParams = useNavigateWithParams();

  const handleOrgClick = (orgId: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithParams("/org", { id: orgId.toString() });
  };

  const postData = {
    id: 1,
    title: "Udela bombustic neco na frontendu nebo ne?",
    content:
      "lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod.",
    author: {
      name: "Milan Tucek",
      avatar: "https://i.pravatar.cc/50",
    },
    mostPopularComment: "Most popular comment",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div className="container">
      <main className="main">
        <h1 className="main__title">Welcome to the Home Page</h1>
        {/* <ul className="org-list">
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
        </ul> */}
        <Post data={postData} />
        <CreatePostForm />
      </main>
    </div>
  );
};

export default HomePage;
