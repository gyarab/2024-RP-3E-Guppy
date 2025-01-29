import { Link } from "react-router-dom";

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

    return (
      <Link
        to={orgLink}
        className="org-logo"
        style={{ '--org-background-color': mainColor } as React.CSSProperties}
      >
        <img src={orgLogo} alt={`${orgName} logo`} />
        <span>{orgName}</span>
      </Link>
    );
  }
  
  export default OrgLogo;
  