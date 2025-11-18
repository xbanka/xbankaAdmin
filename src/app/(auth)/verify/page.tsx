import VerifyPage from "./verifyPage";

const Verify = async({ searchParams }: { searchParams: Promise<Record<string, string | undefined>>; }) => {
  const { token } = await searchParams;
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjA5YjYxMC1jZDE4LTQzYjMtYjg4Yi0zNzdiZDIwNjkxYWQiLCJleHAiOjE3NjMzODg4OTgsInR5cGUiOiJtYWdpY19saW5rIn0.br98434IyUCoD4CZQ31xVGSZP1Uvhehm5blkmPdWgCE";
  return (
    <div className=" h-screen py-7 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md">
        <VerifyPage token={token} />
      </div>
    </div>
  );
};

export default Verify;
