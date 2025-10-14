const LoginLeftCard = () => {
  return (
    <div className="hidden md:flex flex-col justify-center w-1/2 px-4 shrink-0 space-y-6">
      <h1 className="text-5xl font-bold text-slate-950">
        Welcome to CollabHub
      </h1>
      <p className="text-slate-900 text-lg">
        Collaborate, manage projects, and deliver results — all in one
        workspace.
      </p>

      <ul className="space-y-2 text-slate-800 font-semibold list-disc">
        <li>Real-time project management</li>
        <li>Simple and secure Google login</li>
        <li>Free for small teams</li>
      </ul>
    </div>
  );
};
export default LoginLeftCard;
