import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../features/ui/uiSlice";
import { AppDispatch } from "../../app/store";

function ToggleSidebar() {
  const dispatch: AppDispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="toggle-sidebar">
      <input id="checkbox" type="checkbox" />
      <label className="toggle" htmlFor="checkbox" onClick={handleToggle}>
        <div id="bar1" className="bars"></div>
        <div id="bar2" className="bars"></div>
        <div id="bar3" className="bars"></div>
      </label>
    </div>
  );
}

export default ToggleSidebar;
