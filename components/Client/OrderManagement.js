import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import GigRating from "../Gigs/GigRating";
import MakeDispute from "../Gigs/MakeDispute";
import { ethers } from "ethers";
import ErrorBox from "../Validation/ErrorBox";
import TxBox from "../Validation/TxBox";
import { useSigner } from "wagmi";
const {
  contractAddresses,
  Freelanco_abi,
} = require("../../constants");

const OrderManagement = ({ approvedProosals }) => {
  const [selectedOrder, setSeletedOrder] = useState(0);
  const { user, signer, chainId } = useAuth();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [rating, setRating] = useState(null);

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showTxDialog, setShowTxDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [txMessage, setTxMessage] = useState(undefined);
 
  const markSuccessful = async () => {
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
        BigInt(approvedProosals[selectedOrder]?.offerId)
      );
      if (!signer) {
        throw new Error("please connect your wallet");
      }
      let contractWithSigner = FreelancoContract.connect(signer);
      let tx = await contractWithSigner.markSuccessful(
        BigInt(approvedProosals[selectedOrder]?.offerId),
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
        setErrorMessage(e.toString());
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
        BigInt(approvedProosals[selectedOrder]?.offerId)
      );
      if (!signer) {
        throw new Error("please connect your wallet");
      }
      let contractWithSigner = FreelancoContract.connect(signer);
      let tx = await contractWithSigner.disputeContract(
        BigInt(approvedProosals[selectedOrder]?.offerId),
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
        setErrorMessage(e.toString());
      }
      setShowErrorDialog(true);
    }
  };

  return (
    <div className="flex space-x-8">
      <div className="flex-1/4">
        <div className="absoluteCenter">
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
        </div>
        {approvedProosals.map((order, idx) => {
          return (
            <div
              key={idx}
              className="cursor-pointer shadow text-white my-2 py-2"
              onClick={() => {
                setSeletedOrder(idx);
              }}
            >
              <div className="flex justify-start items-center px-5 py-5 pr-10">
                <Image
                  className="rounded-3xl m-4"
                  src={
                    "https://ipfs.io/ipfs/" +
                    approvedProosals[idx]?.gig_detail?.freelancer?.ipfsImageHash
                  }
                  alt="product image"
                  width={50}
                  height={50}
                />
                <div className="flex-col">
                  <p className="font-bold text-md hover:underline cursor-pointer">
                    {order.gig_detail?.freelancer?.name}
                  </p>
                  {order.gig_detail?.freelancer?.isTopRated && (
                    <p className="text-blue-800 text-xs">Top Rated Seller</p>
                  )}
                  <span className="text-sm text-gray-500">
                    {order.gig_detail?.freelancer?.wallet_address.slice(0, 12)}
                    ...
                  </span>
                  <div className="pr-5">
                    <h5
                      className={
                        "text-sm mt-1 font-normal tracking-tight text-gray-900 "
                      }
                    >
                      {order.gig_detail?.title}
                    </h5>{" "}
                  </div>
                  <div className="pr-5">
                    <h5
                      className={
                        "text-sm font-normal tracking-tight text-gray-900 "
                      }
                    >
                      <span className="font-bold">
                        {order?.total_charges?.toFixed(2)} {"MATIC"}
                      </span>
                    </h5>{" "}
                  </div>
                </div>
                {/* <div className="flex items-center mt-2.5 mb-5">
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
                    {order?.gig_detail?.rating}
                  </span>

                  <span className="text-gray-500 text-xs ml-1">
                    ({order?.gig_detail?.rating})
                  </span>
                </div> */}
              </div>
            </div>
          );
        })}
      </div>

      {approvedProosals[selectedOrder] != null ? (
        <div
          className="flex-3/4 w-3/4 flex-col mb-20 border"
        // className={
        //   showReviewDialog === true || showReviewDialog == true
        //     ? "flex flex-3/4 w-3/4 flex-col mb-20 border opacity-5 "
        //     : "flex flex-3/4 w-3/4 flex-col mb-20 border"
        // }
        >
          {
            <div
              // key={idx}
              // className={
              //   // showDialog === true ? "flex flex-col opacity-5" : "flex flex-col "
              // }
              className={
                // showDialog === true ||
                showReviewDialog === true || showDisputeDialog === true
                  ? " opacity-5 "
                  : " "
              }
            >
              <div className="flex justify-around">
                <div className="flex-col">
                  <Image
                    // className="rounded-3xl w-full"
                    src={
                      "https://ipfs.io/ipfs/" +
                      approvedProosals[selectedOrder]?.gig_detail?.freelancer
                        ?.ipfsImageHash
                    }
                    alt=""
                    width={100}
                    height={100}
                    className="h-32 w-32 m-5 mr-0 rounded-2xl"
                  />
                </div>
                <div className="flex w-full flex-col mb-5">
                  <div className="flex justify-between w-full px-10 mt-5">
                    <div className="flex flex-col">
                      <Link
                        href="#"
                      // href={`/freelancer-profile/${approvedProosals[selectedOrder]?.client?._id}`}
                      // to={`/freelancer-profile/6`}
                      >
                        <span className="font-bold text-md hover:underline cursor-pointer">
                          {approvedProosals[selectedOrder]?.gig_detail?.title}{" "}
                        </span>
                      </Link>
                      <span className="font-light text-gray-500">
                        {
                          approvedProosals[selectedOrder]?.gig_detail
                            ?.freelancer?.wallet_address
                        }
                      </span>
                    </div>
                  </div>
                  <p className="ml-10 py-2 mt-4 mr-4 text-sm border-2 p-8 rounded-xl">
                    {approvedProosals[selectedOrder]?.terms?.slice(0, 240)}...
                  </p>
                </div>
              </div>
              <div className="flex justify-around w-full px-10 mb-10">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold text-md">
                    {approvedProosals[selectedOrder]?.total_charges.toFixed(2)}{" "}
                    MATIC
                  </span>
                  <span className="font-light text-gray-500">Fixed Price</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold text-md">
                    {approvedProosals[selectedOrder]?.status}
                  </span>
                  <span className="font-light text-gray-500">Status</span>
                </div>
                {approvedProosals[selectedOrder]?.reviews?.length == 0 && (
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex justify-center items-center gap-x-1">
                      <span className="font-bold text-md">
                        {rating != null ? rating : null}
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
                    <span
                      className="font-light text-blue-800 underline cursor-pointer"
                      onClick={() => {
                        if (
                          approvedProosals[selectedOrder]?.status == "Completed"
                        ) {
                          setShowReviewDialog(true);
                        } else {
                          alert("Waiting for Freelancer to Mark Complete");
                        }
                      }}
                    >
                      Add Review
                    </span>
                  </div>
                )}
              </div>
              <div className="flex w-full justify-around space-x-2 ml-4 pr-10 mb-10 -mt-5">
                <>
                  <button
                    class="text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    onClick={async () => {
                      if (
                        approvedProosals[selectedOrder]?.status == "Completed"
                      ) {
                        await markSuccessful();
                      } else {
                        alert("Waiting for Freelancer to Mark Complete");
                      }
                    }}
                  >
                    <svg class="svg-icon" viewBox="0 0 20 20">
                      <path d="M17.684,7.925l-5.131-0.67L10.329,2.57c-0.131-0.275-0.527-0.275-0.658,0L7.447,7.255l-5.131,0.67C2.014,7.964,1.892,8.333,2.113,8.54l3.76,3.568L4.924,17.21c-0.056,0.297,0.261,0.525,0.533,0.379L10,15.109l4.543,2.479c0.273,0.153,0.587-0.089,0.533-0.379l-0.949-5.103l3.76-3.568C18.108,8.333,17.986,7.964,17.684,7.925 M13.481,11.723c-0.089,0.083-0.129,0.205-0.105,0.324l0.848,4.547l-4.047-2.208c-0.055-0.03-0.116-0.045-0.176-0.045s-0.122,0.015-0.176,0.045l-4.047,2.208l0.847-4.547c0.023-0.119-0.016-0.241-0.105-0.324L3.162,8.54L7.74,7.941c0.124-0.016,0.229-0.093,0.282-0.203L10,3.568l1.978,4.17c0.053,0.11,0.158,0.187,0.282,0.203l4.578,0.598L13.481,11.723z"></path>
                    </svg>
                    <span className="ml-1 text-blue-500">Release Funds</span>
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
          }
          <div
            id="popup-modal"
            tabindex="-1"
            class={
              showReviewDialog === true
                ? "absolute top-1/4 left-2/4 transform -translate-x-1/2 transition-all "
                : "hidden"
            }
          >
            <GigRating
              proposal={approvedProosals[selectedOrder]}
              freelancer={true} //sending to freelancer
              cancel={setShowReviewDialog}
              setRating={setRating}
            />
          </div>
          <div
            id="popup-modal"
            tabindex="-1"
            class={
              showDisputeDialog === true
                ? "-mt-72 bg-white z-50 transition-all z-50"
                : "hidden"
            }
          >
            <MakeDispute
              proposal={approvedProosals[selectedOrder]}
              cancel={setShowDisputeDialog}
              dispute={dispute}
            />
          </div>
        </div>
      ) : (
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="min-h-[calc(70vh)] flex items-center justify-center flex-col">
            <img
              src={"/empty.png"}
              alt=""
              className="w-1/4 h-1/4"
              style={{
                filter: "grayscale(1)",
              }}
            />
            <p className="text-center text-gray-800 font-bold">
              No ongoing orders
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
