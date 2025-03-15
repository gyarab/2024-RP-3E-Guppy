import OrganizationCard from "./OrganizationCard";

import { OrgnizationWithJoin } from "../interfaces/Organization";
import { useNavigateWithParams } from "../hooks/useNavigateParams";

interface OrganizationListProps {
  organizations: OrgnizationWithJoin[];
}

function OrganizationList({ organizations }: OrganizationListProps) {
  const navigateWithParams = useNavigateWithParams();

  const handleCreateOrgClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithParams("/orgs/create", {});
  };

  return (
    <ul className="org-list">
      {organizations.map((org) => (
        <OrganizationCard
          key={org.id}
          name={org.name}
          description={org.description}
          logo={org.logoUrl}
          userJoined={org.userJoined}
        />
      ))}
      <li className="org-card org-card--create" onClick={handleCreateOrgClick}>
        <h3 className="org-card__name">Create your own organization</h3>
      </li>
    </ul>
  );
}

export default OrganizationList;
