import LeftCard from "./_components/LeftCard/LeftCard";
import RightCard from "./_components/RightCard/RightCard";

const DashboardPage = () => {
  return (
    <main>
      <h1>Dashboard Page</h1>
      <div className="flex w-full gap-4">
        <LeftCard />
        <RightCard />
      </div>
    </main>
  );
};
export default DashboardPage;
