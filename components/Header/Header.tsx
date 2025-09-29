import Link from "next/link";

import Sidebar from "./Sidebar/Sidebar";

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between h-32 bg-blue-400">
      <Sidebar />
      <span>CollabHub</span>
      <Link href={'/login'}>Login</Link>
    </header>
  );
};
export default Header;
