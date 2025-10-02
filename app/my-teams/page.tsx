import MyTeams from "./_components/MyTeams/MyTeams";
import NewTeamDialog from "./_components/NewTeamDialog/NewTeamDialog";

const MyTeamsPage = () => {
  return (
    <main>
      <h1>My teams page</h1>
      <NewTeamDialog />
      <MyTeams />
    </main>
  );
};
export default MyTeamsPage;
