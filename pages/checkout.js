import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { addProposal } from "../api/proposal";
import useAuth from "../hooks/useAuth";
import { ethers } from "ethers";
import axios from "axios";
import ErrorBox from "../components/Validation/ErrorBox";
import TxBox from "../components/Validation/TxBox";
import { useSigner } from "wagmi";
import { connectSocket } from "../socket";
const {
  contractAddresses,
  Freelanco_abi,
} = require("../constants");



const checkout = () => {
  const router = useRouter();
  let gig;
  const gig_data = router?.query?.gig;
  if (gig_data) {
    gig = JSON.parse(gig_data);
  }
  console.log("gig------->", gig);
  const [startDate, setStartDate] = useState(new Date());
  const [daoCharge, setDaoCharge] = useState(0);
  const [total, setTotal] = useState();
  const { user, setIsLoggedIn, provider, chainId, signer } = useAuth();
  const [conversationRate, setConvertionRate] = useState(undefined);

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showTxDialog, setShowTxDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [txMessage, setTxMessage] = useState(undefined);
  const [validationErrors, setValidationErrors] = useState("");



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
 

  const handleChange = (e) => {
    setValue("freelancer_charges", e.target.value);
    setDaoCharge((e.target.value * 0.2).toFixed(2));
    setTotal((e.target.value * 1.2).toFixed(2));
    setValue("price", e.target.value * 1.2);
  };

  console.log("user", user);

  const submit_proposal = async () => {
    try {
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
      const errors = {};

      if (!getValues("terms")) {
        errors.terms = "terms is required";
      }

      if (!getValues("freelancer_charges")) {
        errors.charge = "freelancer charges required";
      }

      const selectedDateString = getValues("deadline");

      if (!selectedDateString) {
        errors.deadline = "please mention deadline";
      } else {
        const selectedDate = new Date(selectedDateString);
        const currentDate = new Date();
        const selectedTimestamp = selectedDate.getTime();
        const currentTimestamp = currentDate.getTime();
        if (selectedTimestamp < currentTimestamp) {
          errors.deadline =
            "please select a date that is on or after the current date";
        }
      }
      console.log(errors);

      setValidationErrors(errors);

      if (Object.keys(errors).length != 0) {
        return;
      }

      let contractWithSigner = FreelancoContract.connect(signer);
      console.log(contractWithSigner, "contractWithSigner");
      const currentTimestamp = Math.floor(Date.now() / 1000);

      const _deadline =
        (Math.floor(new Date(data.deadline).getTime() / 1000) -
          currentTimestamp) /
        12;

      let tx = await contractWithSigner.sendOffer(
        gig.tokenId,
        gig.freelancer.wallet_address,
        data.terms,
        Math.floor(_deadline),

        {
          value: ethers.utils.parseEther(
            Math.floor(data.price / 1.11).toString()
          ),
          gasLimit: 1000000,
        }
      );
      console.log("TX HASH OBJECT: ", tx);

      setTxMessage(tx.hash);
      setShowTxDialog(true);
      await tx.wait();
      setShowTxDialog(false);
      router.push("/orders");
      console.log("TX: RECEIPT OBJECT:", tx);
      setTxMessage(tx.hash);
    } catch (e) {
      setShowErrorDialog(true);
      if (e.toString().includes("rejected")) {
        setErrorMessage("User declined the action");
      } else if (e.toString().includes("deadline")) {
        setErrorMessage("Please select a date that is after today's date");
      } else {
        setErrorMessage(e.toString());
      }
    }
  };

  useEffect(() => {
    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`;

    axios
      .get(apiUrl)
      .then((response) => {
        setConvertionRate(response.data.ethereum.usd);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <ErrorBox
        show={showErrorDialog}
        cancel={setShowErrorDialog}
        errorMessage={errorMessage}
      />
      <TxBox
        show={showTxDialog}
        cancel={setShowTxDialog}
        txMessage={txMessage}
      // routeToPush={"/client-profile"}
      />
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)] bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 h-screen px-16 flex-col md:flex-row">
        <div className="w-full flex-col justify-start items-start mr-10">
          <div className="">
            <p className="text-3xl  lg:text-4xl font-semibold leading-7 lg:leading-9 text-white">
              Check out
            </p>
          </div>
          <div className="mt-2">
            <Link
              href="explore"
              className="text-base leading-4 focus:outline-none focus:underline hover:underline hover:text-blue-800 text-gray-300 cursor-pointer"
            >
              Back to exploring?
            </Link>
          </div>
          <div className="mt-12">
            <p className="text-lg  leading-4 text-gray-200">
              Do you have any{" "}
              <a
                href="javascript:void(0)"
                className="focus:outline-none  hover:underline font-semibold focus:underline"
              >
                terms or conditions?
              </a>
            </p>
          </div>
          <div className="my-4 flex flex-col justify-start items-start w-full space-y-8">
            <textarea
              {...register("terms")}
              className="p-8 focus:ring-2 rounded-lg focus:ring-gray-500 focus:outline-none px-2 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-4 w-full bg-gray-400 text-black"
              placeholder="Feel free to write your about your deal"
              rows={5}
            />
            {validationErrors.terms && (
              <span className="text-red-500">{validationErrors.terms}</span>
            )}
          </div>
        </div>
        <div className="flex mt-7 flex-col items-end w-full space-y-6">
          <h1 className="text-2xl  font-semibold leading-6 text-gray-200 self-start">
            Order Summary
          </h1>
          <div className="flex justify-between w-full items-center">
            <p className="text-lg leading-4 text-gray-300">
              Freelancer Charges $
            </p>
            <input
              name="freelancer_charges"
              type="number"
              onChange={handleChange}
              className="mr-2  leading-4  placeholder:italic placeholder:text-slate-400 block bg-gray-100 bg-opacity-5 h-12 border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-white"
            />
          </div>
          {validationErrors.charge && (
            <span className="text-red-500">{validationErrors.charge}</span>
          )}

          <div className="flex justify-between w-full items-center">
            <p className="text-lg  leading-4 text-gray-300">
              DAO Charges (20%)
            </p>
            <p className="text-lg  font-semibold leading-4 text-gray-300">
              ${daoCharge}
            </p>
          </div>
          <div className="flex justify-between w-full items-center">
            <p className="text-lg leading-4 text-gray-300">Sub total</p>
            <p className="text-lg font-semibold leading-4 text-gray-300">
              ${total}
            </p>
          </div>
          <div className="flex justify-between w-full items-center">
            <p className="text-lg leading-4 text-gray-300">Choose Deadline</p>
            <div>
              <input
                {...register("deadline")}
                type="date"
                className="bg-gray-400 text-black"
              // selected={startDate}
              // onChange={(date) => setStartDate(date)}
              />
            </div>
          </div>
          {validationErrors.deadline && (
            <span className="text-red-500">{validationErrors.deadline}</span>
          )}

          <div className="flex justify-end w-full items-center">
            <span
              className="bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 hover:from-blue-800 hover:to-gray-700 p-4 shadow-sm rounded-3xl text-md text-white px-8 mr-2 cursor-pointer"
              onClick={submit_proposal}
            >
              Sign & Pay
            </span>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-purple-900 to-blue-900 h-screen px-4 md:px-8 lg:px-16 xl:px-24 flex flex-col justify-center items-center">
        <div className="border-blue-800 border-2 mx-4 md:mx-10 lg:mx-20 h-[60vh] my-20 rounded-2xl flex-col p-8 md:p-12 lg:p-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl my-6 md:my-10 font-semibold text-white">
            Join the Freelanco Community
          </h1>
          <p className="text-md md:text-lg lg:text-xl xl:text-2xl leading-6 text-gray-300 mb-8 md:mb-12 lg:mb-16">
            Looking to learn more about Freelanco and ZOO? No matter where
            you’re from, here are the best resources available in order to get
            educated, and become part of the Community.
          </p>
          <button
            className="text-lg md:text-xl font-light text-white rounded-2xl px-6 py-4 bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            onClick={() => router.push("dao-login", "dao-portal")}
          >
            Join the DAO
          </button>
        </div>
      </div>
    </>
  );
};

export default checkout;
