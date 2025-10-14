import UserMenu from "../UserMenu/UserMenu";
import Sidebar from "./Sidebar/Sidebar";
import Brand from "./Brand/Brand";
import ThemeToggle from "../General/ThemeToggle/ThemeToggle";

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between h-32 bg-main">
      <Sidebar />
      <Brand />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
export default Header;
