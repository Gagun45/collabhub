import UserMenu from "../UserMenu/UserMenu";
import Sidebar from "./Sidebar/Sidebar";
import Brand from "./Brand/Brand";
import ThemeToggle from "../General/ThemeToggle/ThemeToggle";

const Header = () => {
  return (
    <header className="h-32 grid grid-cols-3 xl:grid-cols-2 bg-main">
      <div className="flex items-center xl:hidden">
        <Sidebar />
      </div>
      <Brand />
      <div className="flex items-center justify-end gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
export default Header;
