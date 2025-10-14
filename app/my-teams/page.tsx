import MyTeams from "./_components/MyTeams/MyTeams";
import NewTeamDialog from "./_components/NewTeamDialog/NewTeamDialog";

const MyTeamsPage = () => {
  return (
    <main>
      <div className="max-w-6xl mx-auto px-4 py-10 w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My teams</h1>
          <NewTeamDialog />
        </div>
        <div className="flex flex-wrap gap-8">
          <MyTeams />
        </div>
      </div>
    </main>
  );
};
export default MyTeamsPage;
