import Link from "next/link";
import UserMenu from "../UserMenu/UserMenu";
import Sidebar from "./Sidebar/Sidebar";

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between h-32 bg-blue-400">
      <Sidebar />
      <Link href={"/"}>CollabHub</Link>
      <UserMenu />
    </header>
  );
};
export default Header;
