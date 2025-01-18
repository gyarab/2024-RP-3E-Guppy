import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface OrgLogoProps {
  orgName: string;
  orgLogo: string;
  orgLink: string;
  mainColor: string;
}

/**
 * Vykreslí jednoduché tlačítko nebo odkaz na základě zadaných vlastností
 * @param orgName - název organizace
 * @param orgLogo - logo organizace
 * @param orgLink - odkaz na stránku organizace
 * @param mainColor - hlavní barva organizace
 */

function OrgLogo({ orgName, orgLogo, orgLink, mainColor }: OrgLogoProps) {
  const isSidebarOpen = useSelector((state: RootState) => state.ui.isSidebarOpen);

  const spanClass = isSidebarOpen ? "" : "closed-span";

    return (
      <Link
        to={orgLink}
        className="org-logo"
        style={{ '--org-background-color': mainColor } as React.CSSProperties}
      >
        <img src={orgLogo} alt={`${orgName} logo`} />
        <span className={spanClass}>{orgName}</span>
      </Link>
    );
  }
  
  export default OrgLogo;
  