import { Outlet } from "react-router-dom";
import { Suspense } from "react";

const AuthLayout = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center rounded-2xl bg-[#F8F7FA]">
      <div className="h-fit w-[450px] bg-white p-8">
        <img src="/weconnect-logo.png" className="mx-auto mb-4" />
        <Suspense fallback={<p>Loading</p>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};
export default AuthLayout;
