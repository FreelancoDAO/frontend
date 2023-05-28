import { freelancerUserouter, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import EditModal from "./EditModal";
import { freelancerProfile } from "../../api/profile";

const FreelancerDetails = ({ freelancerUser, setFreelancerUser }) => {
  const { user, setCurrentFreelancerData, currentFreelancerData } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editFieldName, setEditFieldName] = useState(null);
  const router = useRouter();
  const [allowEdit, setAllowEdit] = useState(false);

  const getProfile = async (id) => {
    const data = await freelancerProfile(id);
    setFreelancerUser(data.user);
    console.log("data----------->", data);

    setCurrentFreelancerData(data.user);
  };

  useEffect(() => {
    const fun = async () => {
      if (user) {
        if (router.query.freelancer) {
          const freelancer = JSON.parse(router.query.freelancer);
          console.log("FF", freelancer);
          const freelancer_id = freelancer._id;
          await getProfile(freelancer_id);
          // setFreelancerUser(JSON.parse(router.query.freelancer));
          setAllowEdit(false);
        } else if (user?.freelancer_ref) {
          // setFreelancerUser(user?.freelancer);
          await getProfile(user?.freelancer_ref);
          setAllowEdit(true);
        }
        // else {
        //   if (router.query.freelancer) {
        //     setFreelancerUser(JSON.parse(router.query.freelancer));
        //   }
        // }
      } else {
        if (router.query.freelancer) {
          const freelancer = JSON.parse(router.query.freelancer);
          console.log("FF", freelancer);
          const freelancer_id = freelancer._id;
          await getProfile(freelancer_id);
          // setFreelancerUser(JSON.parse(router.query.freelancer));
          setAllowEdit(false);
        }
      }
    };
    fun();
  }, [user]);

  const handleClick = (text) => {
    // console.log(e.target.name);
    setEditFieldName(text);
    setShowModal(true);
  };

  // // const calculateProfileCompleteness = () => {};
  // if (router.query.freelancer) {
  //   const freelancerData = JSON.parse(router.query.freelancer);
  // }

  console.log("C", currentFreelancerData);

  return (
    <div className="mb-20 ">
      {showModal && (
        <EditModal
          editFieldName={editFieldName}
          setShowModal={setShowModal}
          freelancerUser={freelancerUser}
          setFreelancerUser={setFreelancerUser}
        />
      )}
      <div className={showModal ? "opacity-10" : ""}>
        <div className="flex justify-between p-8 ">
          <div className="flex flex-col">
            <div className="flex space-x-6 justify-start items-center">
              <div className="flex justify-start items-center space-x-2">
                <p className="font-bold hover:underline text-3xl">
                  {currentFreelancerData?.name}
                </p>
                {allowEdit && (
                  <div className="bg-gray-200 p-2 rounded-full hover:scale-110 cursor-pointer">
                    <img
                      src="https://img.icons8.com/ios/344/ball-point-pen.png"
                      alt=""
                      name="name"
                      onClick={() => handleClick("name")}
                      className="h-5 w-5"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4 items-center justify-start">
              <span className="text-md text-gray-500">
                {currentFreelancerData?.occupation}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-start items-center space-x-2">
              <div className="flex space-x-2 justify-center items-center">
                {currentFreelancerData?.skills?.length === 0 && (
                  <p className="text-gray-500 text-light text-md">
                    Add Skills{" "}
                  </p>
                )}
                {currentFreelancerData?.skill?.map((skill, idx) => (
                  <div
                    key={idx}
                    className="border p-2 mt-2 flex items-center justify-center space-x-5 bg-blue-200 text-gray-800 cursor-pointer transition delay-100 rounded-lg text-xs"
                  >
                    {" "}
                    {skill}{" "}
                  </div>
                ))}
                {allowEdit && (
                  <div className="bg-gray-200 p-2 rounded-full hover:scale-110 cursor-pointer">
                    <img
                      src="https://img.icons8.com/ios/344/ball-point-pen.png"
                      alt=""
                      name="skill"
                      className="h-5 w-5"
                      onClick={() => handleClick("skill")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-start items-center space-x-2 border">
            {currentFreelancerData?.about === "" ||
              currentFreelancerData?.about === null ? (
              <p className="text-sm p-8 w-[calc(90%)] text-blue-300">
                Add something about you to show clients you're worthy
              </p>
            ) : (
              <p className="text-sm p-8 w-[calc(90%)]">
                {currentFreelancerData?.description?.slice(0, 830)}...
              </p>
            )}
            {allowEdit && (
              <div className="bg-gray-200 p-2 rounded-full hover:scale-110 cursor-pointer">
                <img
                  src="https://img.icons8.com/ios/344/ball-point-pen.png"
                  alt=""
                  className="h-5 w-5"
                  name="description"
                  onClick={() => handleClick("description")}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex m-10 -ml-2">
          <div className="w-full flex space-x-4 items-center justify-center">
            <div>
              <img
                src="https://img.icons8.com/material-outlined/344/clock--v1.png"
                alt=""
                className="h-6 w-6"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">
                {currentFreelancerData?.success_rate}
              </span>
              <span>Success Rate</span>
            </div>
          </div>
          <div className="w-full flex space-x-4 items-center justify-center">
            <div>
              <img
                src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                alt=""
                className="h-10"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">
                {currentFreelancerData?.total_earned}
              </span>
              <span>Total Earned</span>
            </div>
          </div>
          <div className="w-full flex space-x-4 items-center justify-center">
            <div>
              <img
                src="https://img.icons8.com/material-outlined/344/clock--v1.png"
                alt=""
                className="h-6 w-6"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">
                {currentFreelancerData?.jobs?.length}
              </span>
              <span>Total Jobs</span>
            </div>
          </div>
        </div>
        <div className="border flex flex-col p-10 border-b-0">
          <div className="flex space-x-5">
            <span className="font-bold">Wallet</span>
            <span>{currentFreelancerData?.wallet_address}</span>
          </div>
        </div>
        <div className="border flex flex-col p-10 border-b- space-y-4">
          <div className="flex justify-between">
            <span className="font-bold">Work Ex.</span>
            {allowEdit && (
              <div className="bg-blue-800 rounded-full p-2 flex items-center space-x-2 px-4 cursor-pointer"
                name="experience"
                onClick={() => handleClick("experience")}>
                <span
                  className="text-white text-sm"
                // onClick={() => setState({ activate: true, deactivate: false })}
                >
                  Add
                </span>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/748/748113.png"
                  className="w-4 h-4"
                  alt=""
                  style={{
                    filter: "brightness(0) invert(1)",
                  }}
                // name="experience"
                // onClick={(e) => handleClick(e)}
                />
              </div>
            )}
          </div>
          <span>
            {currentFreelancerData?.workExperience?.map((emp) => (
              <div key={emp.id} className="border p-4 my-2">
                <div className="flex justify-between">
                  <div className="flex flex-col font-gray-500 items-start">
                    <h1 className="font-bold text-sm">{emp.role}</h1>
                    <h1 className="text-sm font-gray-500">{emp.company}</h1>
                  </div>
                  <div className="flex flex-col text-xs font-gray-500 items-end">
                    <span className="">
                      {emp.startDate?.split("T")[0]} to{" "}
                      {emp.endDate?.split("T")[0]}
                    </span>
                    {/* <span>  
                      {emp.location}, {emp.country}
                    </span> */}
                  </div>
                </div>
              </div>
            ))}
          </span>
        </div>
        <div className="border flex flex-col p-10 border-b-0 space-y-4">
          <div className="flex justify-between">
            <span className="font-bold">Education</span>
            {allowEdit && (
              <div className="bg-blue-800 rounded-full p-2 flex items-center space-x-2 px-4 cursor-pointer"
                onClick={() => handleClick("education")}
              >
                <span className="text-white text-sm">Add</span>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/748/748113.png"
                  className="w-4 h-4"
                  alt=""
                  style={{
                    filter: "brightness(0) invert(1)",
                  }}
                  name="education"
                />
              </div>
            )}
          </div>
          {currentFreelancerData?.education?.map((edu) => (
            <div key={edu._id} className="border p-4 my-2">
              <div className="flex justify-between">
                <div className="flex flex-col font-gray-500 items-start">
                  <h1 className="font-bold text-sm">{edu.degree}</h1>
                  <h1 className="text-sm font-gray-500">{edu.collegeName}</h1>
                </div>
                <div className="flex flex-col text-xs font-gray-500 items-end">
                  <span className="">
                    {edu.startDate.split("T")[0]} to {edu.endDate.split("T")[0]}
                  </span>
                  <span>{/* {emp.location}, {emp.country} */}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border flex flex-col p-10 border-b-0 space-y-4">
          <div className="flex justify-between">
            <span className="font-bold">Projects</span>
            {allowEdit && (
              <div className="bg-blue-800 rounded-full p-2 flex items-center space-x-2 px-4 cursor-pointer"
                onClick={() => handleClick("projects")}>
                <span className="text-white text-sm">Add</span>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/748/748113.png"
                  className="w-4 h-4"
                  alt=""
                  style={{
                    filter: "brightness(0) invert(1)",
                  }}
                  name="projects"
               
                />
              </div>
            )}
          </div>
          {currentFreelancerData?.projects?.map((proj) => (
            <div key={proj._id} className="border p-4 my-2">
              <div className="flex justify-between">
                <div className="flex flex-col font-gray-500 items-start">
                  <h1 className="font-bold text-sm">{proj.title}</h1>
                  <h1 className="text-sm font-gray-500 text-blue-400 hover:underline cursor-pointer">
                    {proj.githubURL}
                  </h1>
                  {/* Live :  <h1 className="text-sm font-gray-500 text-blue-400 hover:underline cursor-pointer">
                    {proj.liveURL}
                  </h1> */}
                </div>
                <div className="flex flex-col text-xs font-gray-500 items-end">
                  <span className="">
                    {/* {emp.period_from} to {emp.period_to} */}
                  </span>
                  <span>{/* {emp.location}, {emp.country} */}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetails;
