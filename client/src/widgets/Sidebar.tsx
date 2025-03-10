import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import OrgLogo from "../shared/ui/OrgLogo";
import CreateOrgButton from "../shared/ui/CreateOrgButton";
import { selectIsSidebarOpen } from "../features/ui/uiSlice";
import { useGetUserOrganizationsQuery } from "../features/organization/organizationApi";
import { Organization } from "../shared/interfaces/Organization";
import { extractColor } from "../shared/utils/extractColor";
import Loader from "../shared/ui/Loader";

function Sidebar() {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const { data, isLoading, error, isError } = useGetUserOrganizationsQuery({
    page: 1,
    limit: 10,
  });
  const [organizationsWithColors, setOrganizationsWithColors] = useState<
    (Organization & { mainColor: string })[]
  >([]);

  const toggleClass = isSidebarOpen ? "" : "sidebar-closed";

  useEffect(() => {
    if (data?.organizations) {
      const orgsWithDefaultColors = data.organizations.map((org: Organization) => ({
        ...org,
        mainColor: "#4a4a4a",
      }));

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
          // Check if the URL is absolute or relative
          if (org.logoUrl.startsWith('http')) {
            img.src = org.logoUrl;
          } else {
            // For relative URLs, prepend the API base URL
            // Ensure there's a slash between the base URL and the path
            const hasLeadingSlash = org.logoUrl.startsWith('/');
            img.src = `http://localhost:3000${hasLeadingSlash ? '' : '/'}${org.logoUrl}`;
          }
        }
      });
    }
  }, [data]);

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
            orgLogo={
              org.logoUrl
                ? org.logoUrl.startsWith('http')
                  ? org.logoUrl
                  : (() => {
                      const hasLeadingSlash = org.logoUrl.startsWith('/');
                      return `http://localhost:3000${hasLeadingSlash ? '' : '/'}${org.logoUrl}`;
                    })()
                : "/images/default-logo.png"
            }
            orgLink={`/organization/${org.id}`}
            mainColor={org.mainColor}
          />
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
