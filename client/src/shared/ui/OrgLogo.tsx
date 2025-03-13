interface OrgLogoProps {
  orgName: string;
  orgLogo: string;
  mainColor: string;
  onClick?: (e: React.MouseEvent) => void;
}

function OrgLogo({ orgName, orgLogo, mainColor, onClick }: OrgLogoProps) {
  return (
    <div
      className="org-logo"
      style={{ "--org-background-color": mainColor } as React.CSSProperties}
      onClick={onClick}
    >
      <img src={orgLogo} alt={`${orgName} logo`} />
      <span>{orgName}</span>
    </div>
  );
}

export default OrgLogo;
