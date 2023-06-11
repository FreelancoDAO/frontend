import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import GigRating from "./GigRating";
import MakeDispute from "./MakeDispute";
import ErrorBox from "../Validation/ErrorBox";
import TxBox from "../Validation/TxBox";
import { useSigner } from "wagmi";
import { ethers } from "ethers";
const { contractAddresses, Freelanco_abi } = require("../../constants");

const MyOrders = ({ ordersData }) => {
  const { user, signer, chainId } = useAuth();
  const [selectedOrder, setSeletedOrder] = useState(0);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [rating, setRating] = useState(null);

  const [showDialog, setShowDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showTxDialog, setShowTxDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [txMessage, setTxMessage] = useState(undefined);


  const markComplete = async () => {
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
      console.log(
        "Sending to Offer ID: ",
        BigInt(ordersData[selectedOrder]?.offerId)
      );
      if (!signer) {
        throw new Error("please connect your wallet");
      }
      let contractWithSigner = FreelancoContract.connect(signer);
      let tx = await contractWithSigner.markComplete(
        BigInt(ordersData[selectedOrder]?.offerId),
        { gasLimit: 500000 }
      );
      setShowTxDialog(true);
      setTxMessage(tx.hash);
      await tx.wait();
      console.log(tx);
      location.reload();
    } catch (e) {
      console.log(e);
      setShowErrorDialog(true);
      if (e.toString().includes("rejected")) {
        setErrorMessage("User declined the action");
      } else if (e.toString().includes("deadline")) {
        setErrorMessage("Please select a date that is after today's date");
      } else {
        setErrorMessage("Oops!");
        // setErrorMessage(e.toString());
      }
      setShowErrorDialog(true);
    }
  };

  const dispute = async (reason) => {
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
      console.log(
        "Sending to Offer ID: ",
        BigInt(ordersData[selectedOrder]?.offerId)
      );
      if (!signer) {
        throw new Error("please connect your wallet");
      }
      let contractWithSigner = FreelancoContract.connect(signer);
      let tx = await contractWithSigner.disputeContract(
        BigInt(ordersData[selectedOrder]?.offerId),
        reason,
        { gasLimit: 5000000 }
      );
      setShowTxDialog(true);
      setTxMessage(tx.hash);
      await tx.wait();

      console.log(tx);
      location.reload();
    } catch (e) {
      console.log(e);
      setShowErrorDialog(true);
      if (e.toString().includes("rejected")) {
        setErrorMessage("User declined the action");
      } else if (e.toString().includes("deadline")) {
        setErrorMessage("Please select a date that is after today's date");
      } else {
        setErrorMessage("Oops!");
        // setErrorMessage(e.toString());
      }
      setShowErrorDialog(true);
    }
  };

  return (
    <div
      className="shadow-lg flex flex-col mb-20"
      style={{
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.5)",
        color: "#f1f1f1",
      }}
    >
      {ordersData?.length > 0 ? (
        <>
          {ordersData.map((order, idx) => (
            <div
              key={idx}
              onClick={() => setSeletedOrder(idx)}
              className={
                showDialog === true ||
                showReviewDialog === true ||
                showDisputeDialog === true
                  ? "flex flex-col opacity-5 "
                  : "flex flex-col "
              }
            >
              <div className="flex justify-around">
                <div className="flex-col">
                  {/* <Image
                    // className="rounded-3xl w-full"
                    src="/bg.jpeg"
                    alt=""
                    width={100}
                    height={100}
                    className="h-32 w-48 m-5 mr-0 rounded-2xl"
                  /> */}
                </div>
                <div className="flex w-full flex-col mb-5">
                  <div className="flex justify-between w-full px-10 mt-5">
                    <div className="flex flex-col">
                      <Link
                        href={`/freelancer-profile/${order?.user?._id}`}
                        // to={`/freelancer-profile/6`}
                      >
                        <span className="font-bold text-md hover:underline cursor-pointer">
                          {order?.user?.wallet_address}
                        </span>
                      </Link>
                    </div>
                  </div>
                  <p className="ml-10 py-2 mt-4 mr-4 text-sm border-2 p-8 rounded-xl">
                    {order?.terms?.slice(0, 240)}...
                  </p>
                </div>
              </div>
              <div className="flex justify-around w-full px-10 mb-10">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold text-md">
                    {order?.total_charges.toFixed(2)} MATIC
                  </span>
                  <span className="font-light text-gray-500">Fixed Price</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold text-md">{order?.status}</span>
                  <span className="font-light text-gray-500">Status</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex justify-center items-center gap-x-1">
                    <span className="font-bold text-md">{rating}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex justify-center items-center gap-x-1">
                      <span className="font-bold text-md">
                        {order?.user?.rating}
                      </span>
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
                    </div>
                    <span className="font-light text-gray-500">Rating</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-around space-x-2 ml-4 pr-10 mb-10 -mt-5">
                <>
                  <button class="text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg class="svg-icon" viewBox="0 0 20 20">
                      <path d="M17.684,7.925l-5.131-0.67L10.329,2.57c-0.131-0.275-0.527-0.275-0.658,0L7.447,7.255l-5.131,0.67C2.014,7.964,1.892,8.333,2.113,8.54l3.76,3.568L4.924,17.21c-0.056,0.297,0.261,0.525,0.533,0.379L10,15.109l4.543,2.479c0.273,0.153,0.587-0.089,0.533-0.379l-0.949-5.103l3.76-3.568C18.108,8.333,17.986,7.964,17.684,7.925 M13.481,11.723c-0.089,0.083-0.129,0.205-0.105,0.324l0.848,4.547l-4.047-2.208c-0.055-0.03-0.116-0.045-0.176-0.045s-0.122,0.015-0.176,0.045l-4.047,2.208l0.847-4.547c0.023-0.119-0.016-0.241-0.105-0.324L3.162,8.54L7.74,7.941c0.124-0.016,0.229-0.093,0.282-0.203L10,3.568l1.978,4.17c0.053,0.11,0.158,0.187,0.282,0.203l4.578,0.598L13.481,11.723z"></path>
                    </svg>
                    <span
                      className="ml-1 text-blue-500"
                      onClick={() => {
                        order?.status == "Approved"
                          ? setShowDialog(true)
                          : order?.status == "Completed"
                          ? alert("Waiting for Client to Approve")
                          : null;
                      }}
                    >
                      {order?.status == "Completed"
                        ? "Waiting for Approval"
                        : "Mark Complete"}
                    </span>
                  </button>
                </>
                <>
                  <button class="text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg class="gray" viewBox="0 0 20 20">
                      <path d="M14.999,8.543c0,0.229-0.188,0.417-0.416,0.417H5.417C5.187,8.959,5,8.772,5,8.543s0.188-0.417,0.417-0.417h9.167C14.812,8.126,14.999,8.314,14.999,8.543 M12.037,10.213H5.417C5.187,10.213,5,10.4,5,10.63c0,0.229,0.188,0.416,0.417,0.416h6.621c0.229,0,0.416-0.188,0.416-0.416C12.453,10.4,12.266,10.213,12.037,10.213 M14.583,6.046H5.417C5.187,6.046,5,6.233,5,6.463c0,0.229,0.188,0.417,0.417,0.417h9.167c0.229,0,0.416-0.188,0.416-0.417C14.999,6.233,14.812,6.046,14.583,6.046 M17.916,3.542v10c0,0.229-0.188,0.417-0.417,0.417H9.373l-2.829,2.796c-0.117,0.116-0.71,0.297-0.71-0.296v-2.5H2.5c-0.229,0-0.417-0.188-0.417-0.417v-10c0-0.229,0.188-0.417,0.417-0.417h15C17.729,3.126,17.916,3.313,17.916,3.542 M17.083,3.959H2.917v9.167H6.25c0.229,0,0.417,0.187,0.417,0.416v1.919l2.242-2.215c0.079-0.077,0.184-0.12,0.294-0.12h7.881V3.959z"></path>
                    </svg>
                    <span className="ml-1 text-gray-500">Contact</span>
                  </button>
                </>
                <>
                  <button
                    class="text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    onClick={() => setShowDisputeDialog(true)}
                  >
                    <svg class="red" viewBox="0 0 20 20">
                      <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                    </svg>
                    <span className="ml-1 text-red-300">Dispute</span>
                  </button>
                </>
              </div>
            </div>
          ))}
          <>
            <div
              id="popup-modal"
              tabindex="-1"
              class={
                showDialog === true
                  ? "absoluteCenter transition-all "
                  : "hidden"
              }
            >
              <div class="relative bg-gray-900 rounded-lg shadow ">
                <button
                  type="button"
                  class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                  data-modal-hide="popup-modal"
                >
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
                <div class="p-6 text-center">
                  <svg
                    aria-hidden="true"
                    class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to mark this completed?
                  </h3>
                  <button
                    data-modal-hide="popup-modal"
                    type="button"
                    onClick={async () => {
                      setShowDialog(false);
                      await markComplete();
                    }}
                    class="text-white bg-blue-800 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    data-modal-hide="popup-modal"
                    type="button"
                    onClick={() => setShowDialog(false)}
                    class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>

            <div
              id="popup-modal"
              tabindex="-1"
              class={
                showReviewDialog === true
                  ? "absolute top-1/4 left-3/4 transform -translate-x-1/2 transition-all "
                  : "hidden"
              }
            >
              <GigRating
                proposal={ordersData[selectedOrder]}
                setRating={setRating}
                cancel={setShowReviewDialog}
              />
              {/* <div class="relative w-full h-full max-w-md md:h-auto">
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button
                    type="button"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                    data-modal-hide="popup-modal"
                  >
                    <svg
                      aria-hidden="true"
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="sr-only">Close modal</span>
                  </button>
                  <div class="p-6 text-center">
                    <svg
                      aria-hidden="true"
                      class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Are you sure you want to accept ETH
                      {proposalsData[selectedOrder]?.price} from{" "}
                      {proposalsData[selectedOrder]?.user?.wallet_address}?
                    </h3>
                    <button
                      data-modal-hide="popup-modal"
                      type="button"
                      onClick={() => {
                        acceptOffer(selectedOrder);
                      }}
                      class="text-white bg-blue-800 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      data-modal-hide="popup-modal"
                      type="button"
                      onClick={() => setShowDialog(false)}
                      class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      No, cancel
                    </button>
                  </div>
                </div>
              </div> */}
            </div>

            <div
              id="popup-modal"
              tabindex="-1"
              class={
                showDisputeDialog === true
                  ? " absoluteCenter z-50 transition-all "
                  : "hidden"
              }
            >
              <MakeDispute
                proposal={ordersData[selectedOrder]}
                cancel={setShowDisputeDialog}
                dispute={dispute}
              />
            </div>
          </>
          <ErrorBox
            cancel={setShowErrorDialog}
            show={showErrorDialog}
            errorMessage={errorMessage}
          />
          <TxBox
            show={showTxDialog}
            cancel={setShowTxDialog}
            txMessage={txMessage}
          />
        </>
      ) : (
        <div className="min-h-[calc(70vh)] flex items-center justify-center flex-col">
          <img
            src={"/empty.png"}
            alt=""
            className="w-1/4 h-1/4"
            style={{
              filter: "grayscale(1)",
            }}
          />
          <p className="text-center text-gray-100 font-bold">
            No orders ongoing
          </p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
