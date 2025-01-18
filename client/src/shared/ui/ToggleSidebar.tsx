import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/store";
import { toggleSidebar } from "../../features/ui/uiSlice";

function ToggleSidebar() {
  const dispatch = useDispatch();

  const isSidebarOpen = useSelector((state: RootState) => state.ui.isSidebarOpen);

  const toggleClass = isSidebarOpen ? "" : "closed";

  return (
    <>
      <div className={`${toggleClass} menuToggle`}>
        <input id="checkbox" type="checkbox" />
        <label onClick={() => dispatch(toggleSidebar())} className="toggle" htmlFor="checkbox">
          <div className="bar bar--top"></div>
          <div className="bar bar--middle"></div>
          <div className="bar bar--bottom"></div>
        </label>
      </div>
    </>
  );
}

export default ToggleSidebar;
