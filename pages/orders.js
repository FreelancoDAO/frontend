import React, { useEffect, useState } from "react";
import { getProposalsOfClient } from "../api/auth";
import GigCard from "../components/Gigs/GigCard";
import useAuth from "../hooks/useAuth";
import ClientOrdersManagement from "../components/Client/OrderManagement";
import { getProposalByGigRef } from "../api/proposal";
import Link from "next/link";
import Image from "next/image";
import GigRating from "../components/Gigs/GigRating";
import MakeDispute from "../components/Gigs/MakeDispute";
import ErrorBox from "../components/Validation/ErrorBox";
import TxBox from "../components/Validation/TxBox";
import { useSigner } from "wagmi";
import { ethers } from "ethers";

const {
  contractAddresses,
  Freelanco_abi,
} = require("../constants");

const ClientProfile = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [userGigs, setUserGigs] = useState([{}]);

  const [proposalsData, setProposalsData] = useState([]);

  const [sentProposals, setSentProposals] = useState([]);
  const [approvedProosals, setApprovedProosals] = useState([]);
  const [successfulProposals, setSuccessfulProposals] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [rating, setRating] = useState(null);

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showTxDialog, setShowTxDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [txMessage, setTxMessage] = useState(undefined);
  // const { data: signer, isError } = useSigner();
  const { user, signer, chainId } = useAuth();

  const [selectedOrder, setSelectedOrder] = useState(undefined);


  useEffect(() => {
    const getData = async () => {
      const result = await getProposalByGigRef();
      if (!result) {
        return;
      }
      setProposalsData(result);

      setApprovedProosals(
        // result.filter((r) => r.status == "Approved" || r.status == "Completed")
        result
        // .filter(
        //   (proposal, index, self) =>
        //     index ===
        //     self.findIndex(
        //       (p) => p.gig_detail._id === proposal.gig_detail._id
        //     )
        // )
      );

      setSuccessfulProposals(result.filter((r) => r.status == "Successful"));
      setSelectedOrder(result[0]);

      // setSentProposals(result.filter((r) => r.status == "Sent"));

      setSentProposals(
        result
          .filter((r) => r.status == "Sent")
          .filter(
            (proposal, index, self) =>
              index === self.findIndex((p) => p.token_id === proposal.token_id)
          )
      );
      setIsLoading(false);
      console.log(
        "Sent",
        result.filter((r) => r.status == "Sent")
      );
      console.log(
        "Rejected",
        result.filter((r) => r.status == "Rejected")
      );
    };

    if (user) {
      getData();
    }
  }, [user]);

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
      console.log("Sending to Offer ID: ", BigInt(selectedOrder?.offerId));
      if (!signer) {
        throw new Error("please connect your wallet");
      }
      let contractWithSigner = FreelancoContract.connect(signer);
      let tx = await contractWithSigner.markSuccessful(
        BigInt(selectedOrder?.offerId),
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
      console.log("Sending to Offer ID: ", BigInt(selectedOrder?.offerId));
      if (!signer) {
        throw new Error("please connect your wallet");
      }
      let contractWithSigner = FreelancoContract.connect(signer);
      let tx = await contractWithSigner.disputeContract(
        BigInt(selectedOrder?.offerId),
        reason,
        { gasLimit: 5000000 }
      );
      setShowDisputeDialog(false);
      setTxMessage(tx.hash);
      setShowTxDialog(true);
      (tx.hash);
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
    <div className="">
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
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        class="inline-flex items-center p-2 mt-20 ml-3 text-sm text-white rounded-lg sm:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span class="sr-only">Open sidebar</span>
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 pt-20 overflow-y-auto bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900">
          <ul class="space-y-2 font-medium">
            {approvedProosals.map((mapProposal) => (
              <li onClick={() => setSelectedOrder(mapProposal)}>
                {console.log("MA", mapProposal)}
                <p
                  href="#"
                  class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    className="rounded-3xl m-4 max-h-sm"
                    // src={"https://ipfs.io/ipfs/" + gig?.freelancer?.ipfsImageHash}
                    src={mapProposal?.gig_detail?.freelancer?.awsImageLink}
                    alt="product image"
                    width={20}
                    height={20}
                    style={{
                      height: 40,
                      width: 40,
                    }}
                  />
                  <div className="flex flex-col">
                    <span class="ml-3">
                      {mapProposal?.gig_detail?.freelancer?.name}
                    </span>
                    <span class="ml-3 text-xs text-gray-400">
                      {mapProposal?.gig_detail?.title}
                    </span>
                    <span class="inline-flex mt-2 items-center bg-gray-900 text-blue-100 text-xs font-medium mr-2 px-4 py-2 rounded-full dark:bg-green-900 dark:text-green-300">
                      <span class="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                      {mapProposal?.status.includes("Over")
                        ? "Disputed"
                        : mapProposal?.status}
                    </span>
                  </div>
                </p>
              </li>
            ))}
            {/* <li>
              <a
                href="#"
                class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="w-6 h-6 text-white transition duration-75 dark:text-white group-hover:text-white dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span class="ml-3">Pending</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-white transition duration-75 dark:text-white group-hover:text-white dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
                <span class="flex-1 ml-3 whitespace-nowrap">Running</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="flex-1 ml-3 whitespace-nowrap">Completed</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-white transition duration-75 dark:text-white group-hover:text-white dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                  <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                </svg>
                <span class="flex-1 ml-3 whitespace-nowrap">Disputed</span>
                <span class="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  3
                </span>
              </a>
            </li> */}

            <li>
              <a
                href="#"
                class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-white transition duration-75 dark:text-white group-hover:text-white dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="flex-1 ml-3 whitespace-nowrap">
                  Post a Request
                </span>
                <span class="inline-flex items-center justify-center px-4 py-2 ml-3 text-sm font-medium text-white  bg-gray-900 rounded-full dark:bg-gray-700 dark:text-white300">
                  Pro
                </span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div
        class="p-4 sm:ml-64  pt-20 min-h-screen bg-cover"
        style={{
          backgroundImage: `url('/ff.jpeg')`,

          // filter: "blur(8px)",
        }}
      >
        {selectedOrder !== undefined ? (
          <div
            className="flex flex-col mb-20"
          // className={
          //   showReviewDialog === true || showReviewDialog == true
          //     ? "flex flex-3/4 w-3/4 flex-col mb-20 border opacity-5 "
          //     : "flex flex-3/4 w-3/4 flex-col mb-20 border"
          // }
          >
            <div
              id="popup-modal"
              tabindex="-1"
              class={
                showDisputeDialog === true
                  ? "mt-20 bg-gray-900 z-50 transition-all rounded-2xl"
                  : "hidden"
              }
            >
              <MakeDispute
                proposal={selectedOrder}
                cancel={setShowDisputeDialog}
                dispute={dispute}
              />
            </div>
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
                    src={selectedOrder?.gig_detail?.awsImageLink}
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
                        <span className="font-bold text-md hover:underline cursor-pointer text-white">
                          {selectedOrder?.gig_detail?.title}{" "}
                        </span>
                      </Link>
                      <span className="font-light text-white">
                        {selectedOrder?.gig_detail?.freelancer?.wallet_address}
                      </span>
                    </div>
                  </div>
                  {/* <p className="ml-10 py-2 mt-4 mr-4 text-sm border-2 p-8 rounded-xl text-white">
                      {selectedOrder?.terms?.slice(0, 240)}...
                    </p> */}
                </div>
              </div>
              <div className="flex justify-around w-full px-10 mb-10 text-white">
                <div class="w-full px-4">
                  <div>
                    <div className="flex w-full ">
                      <ol class="relative border-l border-gray-200">
                        <li class="mb-10 ml-6">
                          <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full -left-3  ring-blue-900 dark:ring-gray-900 dark:bg-blue-900">
                            {/* <img
                                class="rounded-full shadow-lg"
                                src="/docs/images/people/profile-picture-3.jpg"
                                alt="Bonnie image"
                              /> */}
                          </span>
                          <div class="items-center justify-between p-4 bg-gray-900 border border-gray-900 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                            <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                              FreelancoDAO
                            </time>
                            <div class="text-sm font-normal text-gray-500 dark:text-gray-300">
                              Offer sent to{" "}
                              <a
                                href="#"
                                class="font-semibold text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                {selectedOrder?.freelancer_address}
                              </a>{" "}
                              for{" "}
                              <span class="bg-gray-500 text-gray-100 ml-1 text-xs font-normal mr-2 px-2.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-300">
                                {selectedOrder?.gig_detail?.title}
                              </span>
                            </div>
                          </div>
                        </li>
                        {selectedOrder?.status != "Rejected" &&
                          selectedOrder?.status != "Sent" ? (
                          <li class="mb-10 ml-6">
                            <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full -left-3  ring-blue-900 dark:ring-gray-900 dark:bg-blue-900">
                              {/* <img
                                class="rounded-full shadow-lg"
                                src="/docs/images/people/profile-picture-5.jpg"
                                alt="Thomas Lean image"
                              /> */}
                            </span>
                            <div class="p-4 bg-gray-900 border border-gray-900 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                              <div class="items-center justify-between mb-3 sm:flex">
                                <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                  FreelancoDAO
                                </time>
                                <div class="text-sm font-normal text-gray-500 lex dark:text-gray-300">
                                  <span class="font-semibold text-blue-600 dark:text-blue-500 hover:underline mr-1">
                                    {selectedOrder?.freelancer_address}
                                  </span>
                                  approved terms and condition{" "}
                                  <a
                                    href="#"
                                    class="font-semibold text-gray-900 dark:text-white hover:underline"
                                  >
                                    Flowbite Pro
                                  </a>
                                </div>
                              </div>
                              <div class="p-3 text-xs italic font-normal text-gray-200 border border-gray-900 rounded-lg bg-gray-600 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                                {selectedOrder?.terms}
                              </div>
                            </div>
                          </li>
                        ) : (
                          <></>
                        )}

                        {selectedOrder?.status == "Rejected" ? (
                          <>
                            <li class="ml-6">
                              <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full -left-3 ring-blue-900 dark:ring-gray-900 dark:bg-blue-900">
                                {/* <img
                                class="rounded-full shadow-lg"
                                src="/docs/images/people/profile-picture-1.jpg"
                                alt="Jese Leos image"
                              /> */}
                              </span>
                              <div class="items-center justify-between p-4 bg-gray-900 border border-gray-900 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                  FreelancoDAO
                                </time>
                                <div class="text-sm font-normal text-gray-500 lex dark:text-gray-300">
                                  <span class="font-semibold text-blue-600 dark:text-blue-500 hover:underline mr-1">
                                    {selectedOrder?.freelancer_address}
                                  </span>
                                  rejected terms and condition
                                  <span class="font-semibold text-gray-900 dark:text-white">
                                    Finished
                                  </span>
                                </div>
                              </div>
                            </li>
                            <li class="ml-6 mt-10">
                              <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full -left-3 ring-blue-900 dark:ring-gray-900 dark:bg-blue-900">
                                {/* <img
                                class="rounded-full shadow-lg"
                                src="/docs/images/people/profile-picture-1.jpg"
                                alt="Jese Leos image"
                              /> */}
                              </span>
                              <div class="items-center justify-between p-4 bg-gray-900 border border-gray-900 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                  FreelancoDAO
                                </time>
                                <div class="text-sm font-normal text-gray-500 lex dark:text-gray-300">
                                  Refund initiated to
                                  <span class="font-semibold text-blue-600 dark:text-blue-500 hover:underline ml-1">
                                    {selectedOrder?.client_address}
                                  </span>
                                  <span class="font-semibold text-gray-900 dark:text-white">
                                    Finished
                                  </span>
                                </div>
                              </div>
                            </li>
                          </>
                        ) : (
                          <></>
                        )}

                        {selectedOrder?.status == "Completed" ||
                          selectedOrder?.status == "Successful" ? (
                          <li class="ml-6">
                            <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full -left-3 ring-blue-900 dark:ring-gray-900 dark:bg-blue-900">
                              {/* <img
                                class="rounded-full shadow-lg"
                                src="/docs/images/people/profile-picture-1.jpg"
                                alt="Jese Leos image"
                              /> */}
                            </span>
                            <div class="items-center justify-between p-4 bg-gray-900 border border-gray-900 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                              <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                FreelancoDAO
                              </time>
                              <div class="text-sm font-normal text-gray-500 lex dark:text-gray-300">
                                <span class="font-semibold text-blue-600 dark:text-blue-500 hover:underline mr-1">
                                  {selectedOrder?.freelancer_address}
                                </span>
                                completed terms and condition
                                <span class="font-semibold text-gray-900 dark:text-white">
                                  Finished
                                </span>
                              </div>
                            </div>
                          </li>
                        ) : (
                          <></>
                        )}

                        {selectedOrder?.status.includes("Over") ? (
                          <li class="ml-6">
                            <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full -left-3 ring-blue-900 dark:ring-gray-900 dark:bg-blue-900">
                              {/* <img
                                class="rounded-full shadow-lg"
                                src="/docs/images/people/profile-picture-1.jpg"
                                alt="Jese Leos image"
                              /> */}
                            </span>
                            <div class="items-center justify-between p-4 bg-gray-900 border border-gray-900 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                              <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                FreelancoDAO
                              </time>
                              <div class="text-sm font-normal text-gray-500 lex dark:text-gray-300">
                                We regret to inform you that the order you have
                                placed with us has encountered a dispute. Our
                                DAO members is currently investigating the
                                matter and will keep you informed of any
                                developments.
                                <span class="font-semibold text-gray-900 dark:text-white">
                                  Finished
                                </span>
                              </div>
                            </div>
                          </li>
                        ) : (
                          <></>
                        )}
                      </ol>
                    </div>

                    {selectedOrder?.status == "Completed" ? (
                      <button
                        class="inline-block mt-5 w-full py-5 lg:py-3 px-10 text-lg leading-6 lg:leading-7 text-white font-medium tracking-tighter font-heading text-center bg-blue-900 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl"
                        href="#"
                        onClick={async () => {
                          if (selectedOrder?.status == "Completed") {
                            await markSuccessful();
                          } else {
                            alert("Waiting for Freelancer to Mark Complete");
                          }
                        }}
                      >
                        Release Funds
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="flex flex-col px-20 text-white text-xs"
                style={
                  // router.pathname === "/" ||
                  // router.pathname === "/dao" ||
                  // router.pathname.includes("/dao-home") ||
                  // router.pathname === "/join" ||
                  // router.pathname == "/settings"
                  //   ?
                  {
                    zIndex: 10000,
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "#f1f1f1",
                  }

                  // : {}
                }
              >
                <div className="flex justify-between">
                  <h2 class="mb-7 lg:mt-6 text-3xl font-heading font-medium">
                    Order summary
                  </h2>
                  {selectedOrder?.status == "Completed" ? (
                    <>
                      {selectedOrder?.reviews?.length == 0 && (
                        <div className="flex flex-col items-center w-1/3 justify-center">
                          <button
                            class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                            onClick={() => {
                              if (selectedOrder?.status == "Completed") {
                                window.scrollTo(0, 0);
                                setShowReviewDialog(true);
                              } else {
                                alert(
                                  "Waiting for Freelancer to Mark Complete"
                                );
                              }
                            }}
                          >
                            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-transparent text-blue-100 rounded-md group-hover:bg-opacity-0">
                              Give Review
                            </span>
                            <div className="flex justify-center items-center gap-x-1">
                              <span className="font-bold text-md text-white">
                                {rating != null ? rating : null}
                              </span>
                              <svg
                                aria-hidden="true"
                                className="w-5 h-5 text-yellow-300 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <title>First star</title>
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            </div>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div class="flex items-center justify-between py-4 px-10 mb-3 leading-8 bg-gray-800 bg-opacity-50 font-heading font-medium rounded-3xl">
                  <span>DAO Fees</span>
                  <span class="flex items-center text-xs">
                    {/* <span class="mr-2 text-base">$</span> */}
                    <span>
                      {selectedOrder?.total_charges.toFixed(2) * 0.2} MATIC
                    </span>
                  </span>
                </div>
                <div class="flex items-center justify-between py-4 px-10 mb-3 leading-8 bg-gray-800 bg-opacity-50 font-heading font-medium rounded-3xl">
                  <span>Order Total</span>
                  <span class="flex items-center text-xs">
                    {/* <span class="mr-2 text-base"></span> */}
                    <span>{selectedOrder?.total_charges.toFixed()} MATIC</span>
                  </span>
                </div>
              </div>

              <div className="flex w-full px-20 justify-around space-x-2 ml-4 mb-10 -mt-5">
                <>
                  {/* <button
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
                    </button> */}
                </>
                <>
                  {/* <button class="text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                      <svg class="gray" viewBox="0 0 20 20">
                        <path d="M14.999,8.543c0,0.229-0.188,0.417-0.416,0.417H5.417C5.187,8.959,5,8.772,5,8.543s0.188-0.417,0.417-0.417h9.167C14.812,8.126,14.999,8.314,14.999,8.543 M12.037,10.213H5.417C5.187,10.213,5,10.4,5,10.63c0,0.229,0.188,0.416,0.417,0.416h6.621c0.229,0,0.416-0.188,0.416-0.416C12.453,10.4,12.266,10.213,12.037,10.213 M14.583,6.046H5.417C5.187,6.046,5,6.233,5,6.463c0,0.229,0.188,0.417,0.417,0.417h9.167c0.229,0,0.416-0.188,0.416-0.417C14.999,6.233,14.812,6.046,14.583,6.046 M17.916,3.542v10c0,0.229-0.188,0.417-0.417,0.417H9.373l-2.829,2.796c-0.117,0.116-0.71,0.297-0.71-0.296v-2.5H2.5c-0.229,0-0.417-0.188-0.417-0.417v-10c0-0.229,0.188-0.417,0.417-0.417h15C17.729,3.126,17.916,3.313,17.916,3.542 M17.083,3.959H2.917v9.167H6.25c0.229,0,0.417,0.187,0.417,0.416v1.919l2.242-2.215c0.079-0.077,0.184-0.12,0.294-0.12h7.881V3.959z"></path>
                      </svg>
                      <span className="ml-1 text-gray-500">Contact</span>
                    </button> */}
                </>
                <>
                  {selectedOrder?.status == "Approved" ||
                    selectedOrder?.status == "Completed" ? (
                    <button
                      class="text-gray-800 border-red-900  w-full text-center justify-center mt-10 border font-bold py-2 px-4 rounded inline-flex items-center"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setShowDisputeDialog(true);
                      }}
                    >
                      <svg class="red" viewBox="0 0 20 20">
                        <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                      </svg>
                      <span className="ml-1 text-red-300">Dispute</span>
                    </button>
                  ) : (
                    <></>
                  )}
                </>
              </div>
            </div>
          </div>
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
              No orders made
            </p>
          </div>
        )}
      </div>
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
          proposal={selectedOrder}
          freelancer={true} //sending to freelancer
          cancel={setShowReviewDialog}
          setRating={setRating}
        />
      </div>
    </div>
  );
};

export default ClientProfile;
