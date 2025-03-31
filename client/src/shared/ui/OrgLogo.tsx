interface OrgLogoProps {
  orgName: string;
  orgLogo: string;
  mainColor: string;
  onClick?: (e: React.MouseEvent) => void;
  isSelected?: boolean;
}

function OrgLogo({ orgName, orgLogo, mainColor, onClick, isSelected = false }: OrgLogoProps) {
  const hexToRgb = (hex: string) => {
    hex = hex.replace('#', '');
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  };
  
  const rgbColor = hexToRgb(mainColor);
  
  return (
    <div
      className={`org-logo ${isSelected ? 'org-logo-selected' : ''}`}
      style={{ 
        "--org-background-color": mainColor,
        "--org-background-color-rgb": rgbColor
      } as React.CSSProperties}
      onClick={onClick}
    >
      <img src={orgLogo} alt={`${orgName} logo`} />
      <span>{orgName}</span>
    </div>
  );
}

export default OrgLogo;
