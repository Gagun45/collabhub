import UserMenu from "../UserMenu/UserMenu";
import Sidebar from "./Sidebar/Sidebar";
import Brand from "./Brand/Brand";

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between h-32 bg-blue-400">
      <Sidebar />
      <Brand />
      <UserMenu />
    </header>
  );
};
export default Header;
