import React from "react";
import { Button, Countdown } from "../landing/Home";
import { motion } from "framer-motion";
// import openImg from "../assets/open.png";

const Header = () => {
  const recentSearches = [
    "Machine Learning",
    "Data Science",
    "Blockchain dApps",
  ];

  return (
    <>
      <div
        className="flex h-[140vh] -mt-32 bg-cover justify-start bg-black"
        style={
          {
            // backgroundImage: `url('/blo.png')`,
            // "background-repeat": "no-repeat",
          }
        }
      >
        {/* Heading */}
        <div className="video-container">
          <video src={"/movie.mp4"} autoPlay loop muted id="myVideo" />
        </div>

        <div className="flex-col items-center content justify-center border">
          <motion.div
            className="box"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <div className="pl-12">
              <h1 className="text-6xl font-serif font-light text-white">
                Find the most trusted{" "}
                <span className="text-thin italic">
                  {" "}
                  <br /> freelance{" "}
                </span>{" "}
                services <br /> for your business
              </h1>
              <div className="mt-10">
                <Button text={"Explore"} />
              </div>
            </div>
          </motion.div>

          {/* <div className="flex justify-start items-center my-2">
            <input
              type="text"
              className="placeholder:italic placeholder:text-slate-500 w-2/3 block rounded-l-lg bg-white h-10 border border-slate-300 py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm hover:border-blue-400"
              placeholder="Try 'building mobile app'"
            />
            <div className="h-10 w-10 bg-blue-800 rounded-r-lg flex justify-center items-center hover:bg-blue-300 cursor-pointer mr-2">
              <img
                style={{
                  filter: "brightness(0) invert(1)",
                }}
                className="h-5 w-5"
                src="https://img.icons8.com/ios-glyphs/344/search--v1.png"
                alt=""
              />
            </div>
          </div> */}
          {/* <div className="flex space-x-2 items-center">
            <span className="font-light text-md pl-2 mr-2 text-white">
              Populor:{" "}
            </span>
            {recentSearches.map((history, idx) => (
              <div
                key={idx}
                className="text-white text-sm hover:underline cursor-pointer border rounded-2xl px-2"
              >
                {history}
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Header;
