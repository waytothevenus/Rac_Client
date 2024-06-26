import EnterBackupCode from "~/components/Forms/Login/EnterBackupCode";
import Logo from "~/components/Logo";

const recover = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand">
      <div className="container flex flex-col items-center justify-center px-[20px] py-16 md:px-14">
        <Logo />

        <EnterBackupCode />
      </div>
    </main>
  );
};

export default recover;
