import { useEffect, useState } from "react";
import { useGetOrganizationsQuery } from "../features/organization/organizationApi";
import OrganizationList from "../shared/ui/OrganizationList";
import Loader from "../shared/ui/Loader";
import { Organization } from "../shared/interfaces/Organization";

// const organizations = [
//   {
//     id: 1,
//     name: "Organization 1",
//     description: "This is the first organization.",
//     joinCode: "abc123",
//     logoUrl:
//       "uploads/organization/5d8e8d9d6cef86ebcdeeb14c23b6eb4b28d15b492643c77118d56fc321547f90.jpg",
//     createdAt: new Date(),
//   },
// ];

function OrganizationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { data, isLoading } = useGetOrganizationsQuery({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (data) {
      setOrganizations(data.organizations);
    }
  }, [data]);

  return (
    <div className="container">
      {isLoading && <Loader />}
      <h2 className="section-title">Join Any Organization You Like!</h2>
      <OrganizationList organizations={organizations} />
    </div>
  );
}

export default OrganizationPage;
