import React, { useState } from "react";
import DAOLoginForm from "../components/DAO/DAOLoginForm";
import LoginHeader from "../components/Account/LoginHeader";
import DAORegisterForm from "../components/DAO/DAORegisterForm";
import { useRouter } from "next/router";
import Image from "next/image";
import useAuth from "../hooks/useAuth";

const DaoPortal = () => {
  const [wantsToLogin, setWantsToLogin] = useState(false);

  return (
    <div
      className="flex pl-20 pr-20 h-screen w-screen bg-cover pt-10 text-white transition ease-in-out delay-80"
      style={{
        backgroundImage: `url('/ff.jpeg')`,

        // filter: "blur(8px)",
      }}
    >
      <div className="min-h-[calc(70vh)] flex-2/3 w-1/2">
        {wantsToLogin ? (
          <DAOLoginForm setWantsToLogin={setWantsToLogin} />
        ) : (
          <DAORegisterForm setWantsToLogin={setWantsToLogin} />
        )}
      </div>
      <div className="min-h-[calc(70vh)] flex-1/3 w-1/2">
        {wantsToLogin ? (
          <LoginHeader />
        ) : (
          <>
            <div className="h-full flex flex-col items-center p-8 rounded-md mr-10 pt-10">
              <div className="flex items-center justify-center">
                <div className="my-10 w-72 p-5 rounded-md shadow-xl">
                  <img
                    src="https://miro.medium.com/max/1200/1*qGqMY0LcqT1xgdz0z9r8EA.png"
                    alt="Freelanco Ape"
                  />
                  <h2 className="text-md font-bold mt-3">Freelanco Ape</h2>
                  {/* <p className="text-blue-800 text-sm mb-2">
                    Innocent until voted guilty
                  </p> */}
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-blue-800 font-bold">
                      <i className="fab fa-ethereum"></i> 0.11 MATIC
                    </p>
                  </div>
                  <p className="bg-gray-600 h-[0.5px] w-full my-2"></p>
                  <div className="flex items-center">
                    <img
                      src="https://images.squarespace-cdn.com/content/v1/50fc177be4b0dcfb3cb3e0b7/1654466374868-RF4D4358UOLTWHMDB5DL/adlava-logo-design-thumb.png?format=500w"
                      alt="BAYC"
                      className="h-8 w-8 border border-white rounded-full mr-2"
                    />
                    <p className="text-gray-400 text-[12px]">
                      Created by{" "}
                      <span className="text-blue-800 font-bold cursor-pointer">
                        FreelancoDAO
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DaoPortal;
