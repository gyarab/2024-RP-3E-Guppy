import OrgLogo from "../shared/ui/OrgLogo";
import CreateOrgButton from "../shared/ui/CreateOrgButton";
import ToggleSidebar from "../shared/ui/ToggleSidebar";

function Sidebar() {

  return (
    <aside className="sidebar">
      <ToggleSidebar/>
      <div className="organizations">
        <CreateOrgButton/>
        <OrgLogo orgName="Twitter" orgLogo="https://e7.pngegg.com/pngimages/708/311/png-clipart-icon-logo-twitter-logo-twitter-logo-blue-social-media-thumbnail.png" orgLink="/" mainColor="rgb(29, 161, 242)"/>
        <OrgLogo orgName="Netflix" orgLogo="https://image.pmgstatic.com/cache/resized/w960h634/files/images/news/article/166/318/166318830_4c6e50.png" orgLink="/" mainColor="#E50914"/>
        <OrgLogo orgName="Twitch" orgLogo="https://img.freepik.com/premium-vector/twitch-logo_578229-259.jpg?semt=ais_hybrid" orgLink="/" mainColor="#6441a5 "/>
        <OrgLogo orgName="Spotify" orgLogo="https://play-lh.googleusercontent.com/4Yqe9IEyqK1E8FmtSMW-dxNLz4G-uMb07nIkmAy6ppk-Sj3oTx6-EFNEeeZmvpjJ72Q" orgLink="/" mainColor="#1ED760"/>
        <OrgLogo orgName="HBO Max" orgLogo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSelMaZGLLpn2bFzF09E-qrtuQkMllGpS1iMA&s" orgLink="/" mainColor="#330551"/>
      </div>
    </aside>
  );
}

export default Sidebar;
