import Loader from "../shared/ui/Loader";
import OrganizationList from "../shared/ui/OrganizationList";

import { useGetOrganizationsQuery } from "../features/organization/organizationApi";

function HomePage() {
  const { data: organizations, isLoading } = useGetOrganizationsQuery({});

  return (
    <div className="container">
      {isLoading && <Loader />}
      <main className="main">
        <h1 className="main__title">Welcome to the Home Page</h1>
        <OrganizationList organizations={organizations} />
      </main>
    </div>
  );
}

export default HomePage;
