import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import OrgLogo from "../shared/ui/OrgLogo";
import CreateOrgButton from "../shared/ui/CreateOrgButton";
import { selectIsSidebarOpen } from "../features/ui/uiSlice";
import { useGetUserOrganizationsQuery } from "../features/organization/organizationApi";
import { Organization } from "../shared/interfaces/Organization";
import { extractColor } from "../shared/utils/extractColor";
import Loader from "../shared/ui/Loader";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const { data, isLoading, isError } = useGetUserOrganizationsQuery({
    page: 1,
    limit: 10,
  });
  const [organizationsWithColors, setOrganizationsWithColors] = useState<
    (Organization & { mainColor: string })[]
  >([]);

  const navigate = useNavigate();
  const toggleClass = isSidebarOpen ? "" : "sidebar-closed";

  useEffect(() => {
    if (data?.organizations) {
      const orgsWithDefaultColors = data.organizations.map(
        (org: Organization) => ({
          ...org,
          mainColor: "#4a4a4a",
        })
      );

      setOrganizationsWithColors(orgsWithDefaultColors);

      data.organizations.forEach((org: Organization, index: number) => {
        if (org.logoUrl) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const color = extractColor(img);
            setOrganizationsWithColors((prev) => {
              const updated = [...prev];
              updated[index] = { ...updated[index], mainColor: color };
              return updated;
            });
          };
          img.onerror = () => {
            console.error(`Failed to load image for ${org.name}`);
          };
          img.src = org.logoUrl;
        }
      });
    }
  }, [data]);

  const hnadleOrgLogoClick = (orgId: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem("orgId", orgId.toString());
    navigate("/feed");
  };

  return (
    <aside className={`${toggleClass} sidebar`}>
      <div className="organizations">
        <CreateOrgButton />

        {isLoading && <Loader />}

        {isError && (
          <div className="error-message">
            Failed to load organizations. Please try again later.
          </div>
        )}

        {organizationsWithColors.map((org) => (
          <OrgLogo
            key={org.id}
            orgName={org.name}
            orgLogo={org.logoUrl}
            mainColor={org.mainColor}
            onClick={hnadleOrgLogoClick(org.id)}
          />
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
