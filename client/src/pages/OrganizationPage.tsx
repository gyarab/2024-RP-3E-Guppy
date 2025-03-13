import { useEffect, useState } from "react";
import { useGetOrganizationsQuery } from "../features/organization/organizationApi";
import OrganizationList from "../shared/ui/OrganizationList";
import Loader from "../shared/ui/Loader";
import { Organization } from "../shared/interfaces/Organization";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";

function OrganizationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { data, isLoading } = useGetOrganizationsQuery({
    page: 1,
    limit: 10,
  });

  const user = useSelector(selectUser);

  useEffect(() => {
    if (data) {
      const filteredOrganizations = data.organizations.filter(
        (org) => !org.users.some((userOrg) => userOrg.userId === user?.id)
      );

      setOrganizations(filteredOrganizations);
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
