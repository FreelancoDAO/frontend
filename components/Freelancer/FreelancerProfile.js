import { useEffect, useState } from "react";
import EditModal from "./EditModal";
import Link from "next/link";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/router";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import Image from "next/image";
import { ethers } from "ethers";
const { contractAddresses, Freelanco_abi } = require("../../constants");

export const EditRow = ({ setting, allowEdit }) => {
  const [{ activate, deactivate }, setState] = useState({
    activate: false,
    deactivate: false,
  });

  return (
    <div className="flex items-center justify-start pl-10 space-x-16 w-full">
      <div className="flex flex-col items-start justify-center w-2/4">
        <span className="mt-4 capitalize">{setting.title}</span>
        <span className="text-gray-500 text-xs capitalize">{setting.desc}</span>
      </div>
      {/* {allowEdit && (
        <div
          className="bg-gray-200 p-2 rounded-full mt-4 hover:scale-110 cursor-pointer"
          onClick={() => setState({ activate: true, deactivate: false })}
        >
          <img
            src="https://img.icons8.com/ios/344/ball-point-pen.png"
            alt=""
            className="h-5 w-5"
          />
        </div>
      )} */}
    </div>
  );
};

const YourProfile = ({
  setShowManageDisputes,
  showManageDisputes,
  freelancerUser,
  setFreelancerUser,
}) => {
  const [showModal, setShowModal] = useState(false);
  const {
    user,
    chainId,
    signer,
    currentFreelancerData,
    setCurrentFreelancerData,
  } = useAuth();
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset: resetFormState,
    setValue,
    getValues,
    trigger,
    unregister,
  } = useForm({
    mode: "onChange",
  });
  const data = useWatch({ control });
  console.log(data);

  let freelancerData = null;
  console.log(user);

  const allowEdit = user?.freelancer_ref !== null;
  const [completenss, setcompletenss] = useState(undefined);


  const boostProfile = async () => {
    let FreelancoContract;
    if (
      contractAddresses["Gig"][chainId]?.[0] &&
      contractAddresses["Freelanco"][chainId]?.[0]
    ) {

      FreelancoContract = new ethers.Contract(
        contractAddresses["Freelanco"][chainId]?.[0],
        Freelanco_abi,
      );
    }
    console.log("hoooo");
    if (!data?.lock_amount || !data?.deadline) {
      alert("fill both details.....");
    }
    try {
      console.log("amount will be locked ");
      if (!signer) {
        throw new Error("please connect your wallet");
      }
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const _deadline =
        (Math.floor(new Date(data.deadline).getTime() / 1000) -
          currentTimestamp) /
        12;

      let contractWithSigner = FreelancoContract.connect(signer);

      let tx = await contractWithSigner.boostProfile(Math.floor(_deadline), {
        value: ethers.utils.parseEther(
          Math.floor(data.lock_amount / 1.11).toString()
        ),
        gasLimit: 1000000,
      });
      setShowTxDialog(true);
      setTxMessage(tx.hash);
      await tx.wait();
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = () => {};

  useEffect(() => {
    if (currentFreelancerData) {
      const { education, workExperience, projects } = currentFreelancerData;
      const nonEmptyFields = [];

      if (education && education.length > 0) {
        const nonEmptyEducation = education.filter(
          (edu) => edu.collegeName && edu.degree
        );
        nonEmptyFields.push(...nonEmptyEducation);
      }

      if (workExperience && workExperience.length > 0) {
        const nonEmptyWorkExperience = workExperience.filter(
          (exp) => exp.company && exp.role
        );
        nonEmptyFields.push(...nonEmptyWorkExperience);
      }

      if (projects && projects.length > 0) {
        const nonEmptyWorkExperience = projects.filter(
          (exp) => exp.title && exp.description
        );
        nonEmptyFields.push(...nonEmptyWorkExperience);
      }

      const completeness = (nonEmptyFields.length / 3) * 100; // Assuming there are four fields (institution, degree, company, position)

      console.log("COMPLETENESS: ", completeness);

      setcompletenss(completeness.toFixed(0));
    }
  }, [currentFreelancerData]);

  const settings =
    freelancerData !== null
      ? [
          {
            title: "Profile Status",
            desc: freelancerData?.profile_status,
            id: "1",
            callback: "",
          },
          {
            title: "Job Title",
            desc: freelancerData?.occupation,
            id: "2",
            callback: "",
          },
          {
            title: "Your Category",
            desc: freelancerData?.category,
            id: "3",
            callback: "",
          },
        ]
      : [
          {
            title: "Profile Status",
            desc: user?.freelancer?.profile_status,
            id: "1",
            callback: "",
          },
          {
            title: "Job Title",
            desc: user?.freelancer?.occupation,
            id: "2",
            callback: "",
          },
          {
            title: "Your Category",
            desc: user?.freelancer?.category,
            id: "3",
            callback: "",
          },
        ];

  router?.query?.freelancer
    ? console.log("FREL :", JSON.parse(router?.query?.freelancer).workSamples)
    : null;

  return (
    <div
      className="shadow-2xl bg-transparent"
      style={{
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.5)",
        color: "#f1f1f1",
      }}
    >
      {showModal && (
        <div tabindex="-1" class="absoluteCenter bg-gray-900  z-50">
          <div class="relative">
            <div class="relative rounded-lg shadow border-blue-100 border-2 px-10 py-20">
              <div className="text-2xl flex justify-center py-4">
                {" "}
                Boost your profile by locking some ethers
              </div>
              <div className="flex justify-between w-full items-center my-4 mx-2">
                <p className="text-lg leading-4 text-gray-300">amount $</p>
                <input
                  required
                  {...register("lock_amount")}
                  name="lock_amount"
                  type="number"
                  className="mr-2  leading-4  placeholder:italic placeholder:text-slate-400 block bg-gray-100 bg-opacity-5 h-12 border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-white"
                />
              </div>
              <div className="flex justify-between w-full items-center my-4">
                <p className="text-lg leading-4 text-gray-300">
                  Choose Deadline
                </p>
                <div>
                  <input
                    required
                    type="date"
                    {...register("deadline")}
                    className="bg-gray-400 text-black"
                    // selected={startDate}
                  />
                </div>
              </div>
              <div className="flex justify-between my-2 ">
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={() => setShowModal(false)}
                  class="text-white bg-black hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                >
                  Cancel
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={() => boostProfile()}
                  class="text-white bg-black hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!router.query.freelancer && (
        <div className="flex justify-center items-center h-32 flex-col">
          {currentFreelancerData?.awsImageLink && (
            <Image
              src={currentFreelancerData?.awsImageLink}
              // {
              //   "https://ipfs.io/ipfs/" +
              //   (currentFreelancerData?.ipfsImageHash ||
              //     user?.freelancer?.ipfsImageHash)
              // }
              width={100}
              height={100}
              alt=""
              className="h-16 w-16 rounded-full bg-gray-50 shadow-md"
            />
          )}

          <Link href="seller-profile">
            <span className="pt-2 font-bold underline cursor-pointer">
              {/* {freelancerData != null
                ? freelancerUser?.name
                : currentFreelancerData?.name} */}
              {currentFreelancerData?.name || user?.freelancer?.name}
            </span>
          </Link>

          <span className="font-light text-md font-gray-600">
            {freelancerData != null
              ? freelancerData.occupation
              : currentFreelancerData?.occupation ||
                user?.freelancer?.occupation}
          </span>
        </div>
      )}
      {!router.query.freelancer && (
        <>
          <div className="flex flex-col p-8 bg-gray-900 hideItOut">
            {completenss == 100 ? (
              <span className="text-xs font-bold text-blue-600 text-center">
                <div className="h-16 flex items-center justify-center w-full bg-white mt-4 rounded-lg">
                  <p className="font-light font-sans text-xs p-4">
                    {" "}
                    Boost your profile
                  </p>
                  <div className="bg-gray-900 h-8 w-10 p-2 cursor-pointer hover:scale-110 rounded-full relative -right-4 flex justify-center items-center">
                    <img
                      src="https://img.icons8.com/ios-glyphs/344/long-arrow-right.png"
                      alt=""
                      className="h-8 w-8"
                      style={{
                        filter: "brightness(0) invert(1)",
                      }}
                      onClick={() => setShowModal(!showModal)}
                    />
                  </div>
                </div>
              </span>
            ) : (
              <>
                <span className="text-xs font-bold text-blue-600 text-center">
                  Profile Completeness
                </span>
                <div className="flex items-center space-x-4">
                  <div className="w-full bg-blue-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: String(completenss || 0) + "%",
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-light">
                    {completenss || 0}%
                  </span>
                </div>
                <div className="h-16 flex items-center justify-center w-full bg-gray-800 mt-4 rounded-lg">
                  <p className="font-light font-sans text-xs p-4">
                    {" "}
                    {currentFreelancerData?.education?.length == 0
                      ? "Add education so clients know you're a pro"
                      : currentFreelancerData?.workExperience?.length == 0
                      ? "Add work experience so clients know you're a pro"
                      : currentFreelancerData?.projects?.length == 0
                      ? "Add projects so clients know you're a pro"
                      : user?.freelancer?.education?.length != 0
                      ? "Add projects so clients know you're a pro"
                      : ""}
                  </p>
                  <div className="bg-blue-800 h-8 w-10 p-2 cursor-pointer hover:scale-110 rounded-full relative -right-4 flex justify-center items-center">
                    <img
                      src="https://img.icons8.com/ios-glyphs/344/long-arrow-right.png"
                      alt=""
                      className="h-8 w-8"
                      style={{
                        filter: "brightness(0) invert(1)",
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-center items-center text-sm flex-col mb-10 pb-5">
            {settings.map((setting, idx) => (
              <EditRow key={idx} setting={setting} allowEdit={allowEdit} />
            ))}
          </div>

          {router.pathname == "/seller-profile" ? (
            <></>
          ) : (
            <p
              // onClick={() => signOut()}
              href="/dao-login"
              className={
                "font-light border-1 px-3 py-1 rounded-md text-white-800 text-sm cursor-pointer -mt-1 border-blue-800 text-center my-5 mx-2"
                // borderClass
              }
              onClick={() => {
                setShowManageDisputes(!showManageDisputes);
              }}
            >
              {showManageDisputes ? "Go Back" : "Manage Disputes"}
            </p>
          )}
        </>
      )}
      {router.query.freelancer &&
      JSON.parse(router?.query?.freelancer).workSamples?.length > 0 ? (
        JSON.parse(router?.query?.freelancer).workSamples.map((sample) => (
          <figure class="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r">
            <blockquote class="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8">
              <h3 class="text-md font-semibold text-gray-900 ">
                {sample?.reviews[0]?.comment}
              </h3>
            </blockquote>
            <figcaption class="flex flex-col items-center justify-center space-x-3">
              <div className="flex items-center mt-2.5 mb-5">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-yellow-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>First star</title>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {sample?.reviews[0]?.rating.toFixed(2)}
                </span>
              </div>
              <div class="space-y-0.5 font-medium text-left">
                <div class="text-sm text-gray-500">
                  {sample?.client_address.slice(0, 32)}...
                </div>
              </div>
            </figcaption>
          </figure>
        ))
      ) : (
        <></>
      )}
      {router.query.freelancer &&
      JSON.parse(router?.query?.freelancer).workSamples?.length > 0 ? (
        JSON.parse(router?.query?.freelancer).workSamples.map((sample) => (
          <figure class="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r">
            <blockquote class="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8">
              <h3 class="text-md font-semibold text-gray-900 ">
                {sample?.reviews[0]?.comment}
              </h3>
            </blockquote>
            <figcaption class="flex flex-col items-center justify-center space-x-3">
              <div className="flex items-center mt-2.5 mb-5">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-yellow-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>First star</title>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {sample?.reviews[0]?.rating.toFixed(2)}
                </span>
              </div>
              <div class="space-y-0.5 font-medium text-left">
                <div class="text-sm text-gray-500">
                  {sample?.client_address.slice(0, 32)}...
                </div>
              </div>
            </figcaption>
          </figure>
        ))
      ) : (
        <></>
      )}
      {router.query.freelancer &&
      JSON.parse(router?.query?.freelancer).workSamples?.length > 0 ? (
        JSON.parse(router?.query?.freelancer).workSamples.map((sample) => (
          <figure class="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r">
            <blockquote class="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8">
              <h3 class="text-md font-light font-semibold text-gray-900 ">
                {sample?.reviews[0]?.comment}
              </h3>
            </blockquote>
            <figcaption class="flex flex-col items-center justify-center space-x-3">
              <div className="flex items-center mt-2.5 mb-5">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-yellow-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>First star</title>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {sample?.reviews[0]?.rating.toFixed(2)}
                </span>
              </div>
              <div class="space-y-0.5 font-medium text-left">
                <div class="text-sm text-gray-500">
                  {sample?.client_address.slice(0, 32)}...
                </div>
              </div>
            </figcaption>
          </figure>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default YourProfile;
