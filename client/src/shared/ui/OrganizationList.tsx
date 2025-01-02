import OrganizationCard from "./OrganizationCard";

import { Organization } from "../interfaces/Organization";
import { useNavigateWithParams } from "../hooks/useNavigateParams";

interface OrganizationListProps {
  organizations?: Organization[];
}

function OrganizationList({ organizations }: OrganizationListProps) {
  const navigateWithParams = useNavigateWithParams();

  const handleOrgClick = (orgId: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithParams("/org", { id: orgId.toString() });
  };

  const handleCreateOrgClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithParams("/org/create", {});
  };
  return (
    <ul className="org-list">
      {organizations?.map((org) => (
        <OrganizationCard
          key={org.id}
          name={org.name}
          description={org.description}
          logo={"http://localhost:3000/" + org.logoUrl}
          onClick={handleOrgClick(org.id)}
        />
      ))}
      <li className="org-card org-card--create" onClick={handleCreateOrgClick}>
        <h3 className="org-card__name">Create your own organization</h3>
      </li>
    </ul>
  );
}

export default OrganizationList;
