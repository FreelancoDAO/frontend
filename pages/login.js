import React, { useState } from "react";
import LoginForm from "../components/Account/LoginForm";
import LoginHeader from "../components/Account/LoginHeader";
import RegisterForm from "../components/Account/RegisterForm";

const LoginPage = () => {
  const [wantsToLogin, setWantsToLogin] = useState(true);

  return (
    <div className="video-container flex justify-between text-black" >
      
      <video src={"./data_grid.mp4"} autoPlay loop muted id="myVideo" className="video-background" style={{ opacity: 0.5 }} />
      <div className="w-[100vw] h-[60vh] mt-32 absolute" style={{
        zIndex: -1,
        background: "rgba(0, 0, 0, 1)",

      }}></div>
      <div className="min-h-[calc(70vh)] lg:flex-2/3 w-full lg:w-1/2 relative z-10 rounded-xl   ">
        <LoginForm setWantsToLogin={setWantsToLogin} />
      </div>
      <div className="min-h-[calc(70vh)] mt-20 flex-1/3 w-1/2  lg:block">
        <LoginHeader />
      </div>
    </div>
  );

  // return (
  //   <div
  //     className="flex pr-20 h-screen w-screen bg-cover transition ease-in-out delay-80"
  //     style={{
  //       backgroundImage: `url('/stars.jpeg')`,

  //       // filter: "blur(8px)",
  //     }}
  //   >
  //     <div className="min-h-[calc(70vh)] lg:flex-2/3 w-full lg:w-1/2">
  //       <LoginForm setWantsToLogin={setWantsToLogin} />
  //     </div>
  //     <div className="min-h-[calc(70vh)] mt-20 flex-1/3 w-1/2 hidden lg:block">
  //       <LoginHeader />
  //     </div>
  //   </div>
  // );
};

export default LoginPage;
