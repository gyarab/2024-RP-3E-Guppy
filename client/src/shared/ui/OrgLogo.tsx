import { Link } from "react-router-dom";


interface OrgLogoProps {
    orgName: string;
    orgLogo: string;
    orgLink: string;
}

/**
 * Vykreslí jednoduché tlačítko nebo odkaz na základě zadaných vlastností
 * @param orgName - název organizace
 * @param orgLogo - logo organizace
 * @param orgLink - odkaz na stránku organizace
 */

function OrgLogo({orgName, orgLogo, orgLink}: OrgLogoProps) {
    return (
        <div className="org-logo">
            <Link to={orgLink}><img src={orgLogo} alt={orgName} /></Link> {/*Anchor v Link komponentu dosírá spodní část loga a protahuje jí*/}
        </div>
    )
}

export default OrgLogo;