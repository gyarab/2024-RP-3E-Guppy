import OrgLogo from "../shared/ui/OrgLogo";
import Button from "../shared/ui/Button";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="organizations">
        <h2 className="organizations__title">Organizations</h2>
        <Button variant="accent">Create Org</Button>

        {/* <OrgLogo
          orgLink="/signup"
          orgName="Organization"
          orgLogo="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg"
        />
        <OrgLogo
          orgLink="/signup"
          orgName="Organization"
          orgLogo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxBzH8UEnwhZ3xdq-cC4D9_dK4nu_Cjk9p-Q&s"
        />
        <OrgLogo
          orgLink="/signup"
          orgName="Organization"
          orgLogo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRMRwRwoKMcVOwjcvnvAMPNf84x1lb-N_Wog&s"
        />
        <OrgLogo
          orgLink="/signup"
          orgName="Organization"
          orgLogo="https://yt3.googleusercontent.com/hNy_TSr82eNOUiiI64ot0E8oH8kzw3npqdajanbEHq4Q9hxGiXIDPThoHjKRBTEGxb2xrOhBKg=s900-c-k-c0x00ffffff-no-rj"
        />
        <OrgLogo
          orgLink="/signup"
          orgName="Organization"
          orgLogo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7_6iKwEof8NGwqg6GHqoYuXiU9HF6YLqAUQ&s"
        />
        <OrgLogo
          orgLink="/signup"
          orgName="Organization"
          orgLogo="https://www.youtube.com/img/desktop/yt_1200.png"
        />
        <OrgLogo
          orgLink="/signup"
          orgName="Organization"
          orgLogo="https://yt3.googleusercontent.com/ytc/AIdro_laRShJ23cRl_TByWDUJpcUvpHap8AcQnYa49_inkgNSyc=s900-c-k-c0x00ffffff-no-rj"
        /> */}
      </div>
      <div className="links"></div>
    </aside>
  );
}

export default Sidebar;
