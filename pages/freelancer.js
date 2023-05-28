import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import axiosInstance from "../axios";
import { addFreelancer } from "../api/freelancer";
import { emailVerify } from "../api/auth";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { default as ReactSelect } from "react-select";
import { components } from "react-select";
import TxBox from "../components/Validation/TxBox";
import jwt_decode from "jwt-decode";
import useGigs from "../hooks/useGigs";
import { uploadImage } from "../api/ipfs";

const CreateFreelancerPage = () => {
  const { user, setUser, setToken } = useAuth();

  const { categories } = useGigs();

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skill",
  });
  console.log(data);

  const router = useRouter();

  const [counter, setCounter] = useState(0);
  const [validationErrors, setValidationErrors] = useState("");
  const [imageUploaded, setImageUploaded] = useState(null);
  const [showTxDialog, setShowTxDialog] = useState(false);
  const [txMessage, setTxMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValue("category", categories?.[0]?.title)
  }, [categories])

  useEffect(() => {
    setValidationErrors("");
  }, [data])

  const [skill, setSkill] = useState([]);

  console.log("skill", skill);

  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  const skillOptions = [
    { value: "ReactJs", label: "ReactJs" },
    { value: "AngularJs", label: "AngularJs" },
    { value: "React Native", label: "React native" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Mongo", label: "Mongo" },
  ];
  function handleChange(selected) {
    const skill_data = selected.map((s) => s.value);
    setValue("skill", []); // Remove all items from the fields array
    skill_data.forEach((skill) => {
      append(skill); // Add new skill fields based on the selected skills
    });
  }

  function handleValidation() {
    const errors = {};

    if (!getValues("name")) {
      errors.name = "Name is required";
    }

    if (!getValues("email")) {
      errors.email = "Email is required";
    }

    if (!getValues("category")) {
      errors.category = "Category is required";
    }

    if (!getValues("ipfsImageHash")) {
      errors.image = "image is required";
    }

    if (Object.keys(errors).length == 0 && counter == 0) {
      setCounter((prevState) => prevState + 1);
      setValidationErrors("");
      return;
    }

    if (!getValues("occupation")) {
      errors.occupation = "please mention your job role";
    }
    if (getValues("description")?.split(" ").length < 20) {
      errors.description = "write at least 20 words about you ";
    }

    console.log("errors", errors);

    if (Object.keys(errors).length == 0 && counter == 1) {
      setCounter((prevState) => prevState + 1);
      setValidationErrors("");
      return;
    }
    if (getValues("skill").length < 2) {
      errors.skill = `select at least 2 skills`;
    }
    if (Object.keys(errors).length == 0 && counter == 2) {
      setValidationErrors("");
      return true;
    }

    setValidationErrors(errors);
  }

  const updateUser = async () => {
    try {
      setIsLoading(true);
      const userData = { ...data, wallet_address: user?.wallet_address };
      const result = await addFreelancer(userData);
      router.push("/seller");
      const token = result.token;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(result.freelancer);
    } catch (err) {
      console.log(err);
    }
  };

  const sendImageToBackend = async (e) => {
    setShowTxDialog(true);
    setTxMessage("profile picture uploading to ipfs....");
    setImageUploaded(e.target.files[0]);
    const dataF = new FormData();
    dataF.append("file", e.target.files[0]);
    const res = await uploadImage(dataF);
    console.log("eeeeeeeeeee", res);
    setValue("ipfsImageHash", res.ipfsImageHash);
    setValue("awsImageLink", res.awsImageLink);
    setTxMessage(`ipfs hash: ${res.ipfsImageHash}`);
    setTimeout(() => {
      setShowTxDialog(false);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)]  bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 h-screen  ">
      <TxBox
        show={showTxDialog}
        cancel={setShowTxDialog}
        txMessage={txMessage}
      // routeToPush={"/client-profile"}
      />
      <div className="mt-20 w-[calc(70vw)] shadow-lg   bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 shadow-md rounded-lg backdrop-blur-lg transition-all duration-500 text-white " style={{ boxShadow: '6px 10px 37px 8px rgba(0,0,0,0.75)' }}>
        <div className="h-16 w-full flex justify-start items-center border-b pl-8">
          <span className="font-serif text-2xl">Getting Started</span>
        </div>
        <div className="flex items-start justify-center p-8 flex-col">
          {counter === 0 && (
            <>
              <h1 className="font-bold text-xl mb-4">
                {" "}
                Ready to start selling on FreelancoDAO?
              </h1>
              {/* Cards */}
              <div className=" flex justify-between flex-col sm:flex-row w-full">
                <div className="flex space-x-16 w-full">
                  <form
                    // onSubmit={(e) => {
                    //   e.preventDefault();
                    // }}
                    className="flex flex-col mt-2 w-full"
                  >
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-300"
                    >
                      Full Name
                    </label>
                    <input
                      name="name"
                      {...register("name")}
                      type="text"
                      className="mr-2 placeholder:italic placeholder:text-slate-400 block bg-gray-100 bg-opacity-5 h-12 my-2 border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                    />
                    {validationErrors.name && (
                      <span className="text-red-500">
                        {validationErrors.name}
                      </span>
                    )}
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-300"
                    >
                      Email
                    </label>
                    <input
                      name="email"
                      {...register("email")}
                      type="email"
                      className="mr-2 placeholder:italic placeholder:text-slate-400 block bg-gray-100 bg-opacity-5 h-12 my-2 border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                    />
                    {validationErrors.email && (
                      <span className="text-red-500">
                        {validationErrors.email}
                      </span>
                    )}

                    <label
                      htmlFor="category"
                      className="text-sm font-semibold text-gray-300"
                    >
                      Category
                    </label>
                    <select
                      name="category"
                      {...register("category")}
                      className=" bg-gray-900 text-gray-100 my-2 py-2 border-transparent rounded-lg px-2 font-light w-full focus:border-transparent active:border-transparent focus-visible:border-transparent"
                      value={data.category}
                      onChange={(e) => {
                        setValue("category", e.target.value);
                      }}
                    >
                      {categories
                        ?.map((c) => c.title)
                        ?.map((category, idx) => (
                          <option key={idx} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>

                    {validationErrors.category && (
                      <span className="text-red-500">
                        {validationErrors.category}
                      </span>
                    )}
                  </form>
                </div>

                <div className="flex-col w-full item-end">
                  <label
                    htmlFor="profilePic"
                    className="text-sm font-semibold text-gray-300 ml-4 -mb-10"
                  >
                    Profile Picture
                  </label>
                  {imageUploaded ? (
                    <Image
                      src={URL.createObjectURL(imageUploaded)}
                      width={1}
                      height={1}
                      alt="Change?"
                      className="w-full h-[40vh] cursor-pointer pl-10"
                    />
                  ) : (
                    <div className="flex-col w-full">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold text-gray-500 ml-4 -mb-10"
                      ></label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          for="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 ml-4"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              aria-hidden="true"
                              className="w-10 h-10 mb-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              ></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={(e) => sendImageToBackend(e)}
                          />
                        </label>
                      </div>
                      {validationErrors.image && (
                        <span className="text-red-500">
                          {validationErrors.image}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {/* </div> */}
              </div>
              <div className="flex w-full mt-5 justify-end items-end">
                <button
                  className="bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 hover:from-blue-800 hover:to-gray-700 p-4 shadow-sm rounded-3xl text-md text-white px-8 mr-2"
                  onClick={handleValidation}
                >
                  Continue
                </button>
              </div>
            </>
          )}
          {counter === 1 && (
            <>
              <h1 className="font-bold text-xl mb-4"> Your Occupation </h1>
              <input
                type="text"
                {...register("occupation")}
                className="mr-2 w-2/3 placeholder:italic placeholder:text-slate-400 block bg-gray-100 bg-opacity-5 h-12 my-2 border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                name="occupation"
              />
              {validationErrors.occupation && (
                <span className="text-red-500">
                  {validationErrors.occupation}
                </span>
              )}
              <label
                htmlFor="description"
                className="font-bold text-xl mb-4 mt-4"
              >
                Pitch yourself
              </label>
              <textarea
                name="description"
                {...register("description")}
                className="mr-2 w-2/3 h-32 placeholder:italic placeholder:text-slate-400 block bg-gray-100 bg-opacity-5 my-2 border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              />
              {validationErrors.description && (
                <span className="text-red-500">
                  {validationErrors.description}
                </span>
              )}
              <div className="flex w-full h-32 justify-end items-end">
                <button
                  className="bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 hover:from-blue-800 hover:to-gray-700 p-4 shadow-sm rounded-3xl text-md text-white px-8 mr-2"
                  onClick={() => {
                    setCounter((prevState) => prevState - 1);
                  }}
                >
                  Back
                </button>
                <button
                  className="bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 hover:from-blue-800 hover:to-gray-700 p-4 shadow-sm rounded-3xl text-md text-white px-8 mr-2"
                  // onClick={() => {
                  //   setCounter((prevState) => prevState + 1);
                  // }}
                  onClick={handleValidation}
                >
                  Continue
                </button>
              </div>
            </>
          )}
          {counter === 2 && (
            <>
              {isLoading ? (
                <div className="flex items-center align-center justify-center mt-5 ml-5 w-full">
                  <img src="loading.gif" height={50} width={50} />
                </div>
              ) : (
                <>
                  <label className="block font-bold text-xl mb-2">
                    Skills:
                  </label>
                  <ReactSelect
                    options={skillOptions}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={handleChange}
                    allowSelectAll={true}
                    value={skill.optionSelected}
                    className="block w-full bg-gray-200 text-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: "black",
                        color: "white",
                        overflow: "auto",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: "black",
                        color: "white",
                      }),
                    }}
                  />

                  {validationErrors.skill && (
                    <span className="text-red-500">
                      {validationErrors.skill}
                    </span>
                  )}

                  <div className="flex w-full h-24 justify-end items-end">
                    <button
                      className="bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 hover:from-blue-800 hover:to-gray-700 p-4 shadow-sm rounded-3xl text-md text-white px-8 mr-2"
                      onClick={() => {
                        setCounter((prevState) => prevState - 1);
                      }}
                    >
                      Back
                    </button>
                    <button
                      className="bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 hover:from-blue-800 hover:to-gray-700 p-4 shadow-sm rounded-3xl text-md text-white px-8 mr-2"
                      // onClick={() => {
                      //   // setCounter((prevState) => prevState + 1);
                      //   updateUser();
                      // }}
                      onClick={async () => {
                        const p = handleValidation();
                        console.log("ppppppppppppppp", p);
                        if (p) {
                          await updateUser();
                        }
                      }}
                    >
                      Save & Continue
                    </button>
                  </div>
                </>
              )}
            </>
          )}
          {/* {counter === 3 && (
            <>
              <h1 className="font-bold text-xl mb-4"> Account Security </h1>
              <div className="flex justify-between mr-10 w-full items-center my-5">
                <div className="flex gap-x-4 items-center">
                  <img
                    src={
                      "https://static.vecteezy.com/system/resources/previews/000/547/370/original/envelope-mail-icon-vector-illustration.jpg"
                    }
                    width={40}
                    height={40}
                  />
                  <h1 className="text-md font-light text-gray-900">Email</h1>
                  <span className="text-xs text-gray-400 italic">Private</span>
                </div>
                <div>
                  <button
                    disabled={user?.is_email_verified}
                    className={
                      user?.is_email_verified
                        ? "bg-blue-300 p-4 shadow-sm rounded-3xl text-md text-white"
                        : "border px-8 py-4 text-xs font-light  rounded-xl -mt-10"
                    }
                  >
                    {user?.is_email_verified ? "Verified" : "verify"}
                  </button>
                </div>
              </div>
              <div className="flex justify-between mr-10 w-full items-center my-5">
                <div className="flex gap-x-4 items-center">
                  <img
                    src={
                      "data:image/jpeg;base64,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"
                    }
                    width={40}
                    height={40}
                  />
                  <h1 className="text-md font-light text-gray-900">Wallet</h1>
                  <span className="text-xs text-gray-400 italic">Private</span>
                </div>
                <div>
                  <button
                    disabled={user?.metamask_verified}
                    className={
                      user?.metamask_verified
                        ? "bg-blue-300 p-4 shadow-sm rounded-3xl text-md text-white"
                        : "border px-8 py-4 text-xs font-light  rounded-xl -mt-10"
                    }
                    onClick={() => handleAuth()}
                  >
                    {user?.metamask_verified ? "Verified" : "verify"}
                  </button>
                </div>
              </div>

              <div className="flex w-full h-20 justify-end items-end">
                <button
                  className="bg-blue-300 p-4 shadow-sm rounded-3xl text-md text-white px-8 mr-2"
                  onClick={() => {
                    setCounter((prevState) => prevState - 1);
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (user?.metamask_verified && user?.is_email_verified)
                      router.push("seller");
                    else alert("please verify email and wallet both !!!");
                  }}
                  className={
                    loading
                      ? "p-4 rounded-3xl text-md text-white w-32"
                      : "bg-blue-300 p-4 shadow-sm rounded-3xl text-md text-white w-32"
                  }
                >
                  <span className="">Submit</span>
                </button>
              </div>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CreateFreelancerPage;
