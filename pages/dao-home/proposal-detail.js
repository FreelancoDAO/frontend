import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connectSocket, socket } from "../../socket";
import useAuth from "../../hooks/useAuth";
import Chat from "../../components/chat/Chat";
import { Fragment } from "react";

import { MessageLeft, MessageRight } from "../../components/chat/Message";
// import { List, Typography } from "@mui/material";
// import ChatMessage from "../../components/chat/ChatMessage";
import { ethers } from "ethers";

const DaoProposalDetail = () => {
  const router = useRouter();
  const { user, daoNFTContract } = useAuth();
  const [proposal, setProposal] = useState(null);
  console.log("proposal", proposal);
  useEffect(() => {
    if (router?.query?.proposal) {
      setProposal(JSON.parse(router.query.proposal));
    }
  }, [router]);
  const [conversations, setConversations] = useState([]);
  const [conversationsData, setConversationsData] = useState();

  const [daoMessages, setDaoMessages] = useState([]);
  console.log("convo", conversationsData);
  console.log("conversations", conversations);
  useEffect(() => {
    if (!socket && user && router.query) {
      connectSocket(user.wallet_address);
    }
    if (socket && proposal) {
      console.log("EMITING", proposal.gig_token_id);
      socket.emit(
        "get_messages_by_gig_id",
        { offer_id: proposal?.offerId },
        (data) => {
          // setConversationsData(data);
          console.log("DATA: ", data);
          setConversationsData(data);
          setConversations(data.messages);
          setDaoMessages(data?.dao_messages);

          // setMessagesList(data);
        }
      );
    }
  }, [socket, user, router.query.data, proposal]);

  const [messageState, setMessageState] = useState(undefined);

  let message;

  console.log("DAO", daoMessages);

  const getConversations = () => {
    console.log("emiting2");

    if (!socket && user) {
      connectSocket(user.wallet_address);
    }

    if (user && socket) {
      socket.emit(
        "get_messages_by_gig_id",
        { offer_id: proposal?.offerId },
        (data) => {
          setConversationsData(data);
          setConversations(data.messages);
          setDaoMessages(data?.dao_messages);
        }
      );
    }
  };

  const sendMessage = () => {
    message = {
      message: messageState,
      conversation_id: conversationsData?._id,
      from: user.wallet_address,
      to: null,
      type: "Text",
    };
    console.log("message", message);
    console.log("socket", socket);
    if (socket) {
      socket.emit("text_message", message, function (response) {
        console.log("RES:", response);
        if (response) {
          setMessageState("");
          message = {
            ...message,
            text: message.message,
            created_at: new Date(),
          };
          setDaoMessages([...daoMessages, message]);
        } else {
        }
      });
    }
  };

  const getTimeDisplayCondition = (messages, id) => {
    if (messages.length > 1) {
      let currentTime = new Date(messages[id].created_at).getMinutes();
      if (id == 0) {
        return true;
      } else if (id > 0) {
        let prevTime = new Date(messages[id - 1].created_at).getMinutes();
        if (
          messages[id].from == messages[id - 1].from &&
          prevTime == currentTime
        ) {
          return false;
        } else {
          return true;
        }
      }
    }
    return true;
  };

  function trimAddress(address) {
    if (address) return address.slice(0, 6) + "..." + address.slice(-4);
  }

  const generateDate = (date) => {
    return (
      <div style={{ textAlign: "center" }}>
        {new Date(date).toLocaleDateString()}
      </div>
    );
  };
  const handleButtonClick = () => {
    window.open(`https://www.tally.xyz/gov/freelancodao-beta/proposal/${proposal?.tallyId}`, '_blank');
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center text-center w-full text-white font-extrabold"></div>
      <div className="px-4 md:px-40 py-4 pt-20  bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 font-medium">
        <div className="w-full">
          <p className="text-3xl md:text-5xl text-white ">Proposal</p>

          <button class="flex items-center justify-center my-12 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={handleButtonClick}>
            <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            Vote Now
          </button>

          {/* <div class="flex justify-end space-x-4">
            <button class="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              For
            </button>

            <button class="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Against
            </button>

            <button class="flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
              <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="8"></line>
              </svg>
              Abstain
            </button>
          </div> */}

          {/* <iframe src={`https://www.tally.xyz/gov/freelancodao-beta/proposals`} style={{ width: "100%", height: "600px" }}></iframe> */}
          <div className="flex justify-between items-center">
            <p className="text-sm md:text-md font-bold text-gray-400">
              Reason for Proposal
            </p>
            <div className="flex flex-col">
              <p className="text-sm md:text-md font-bold py-4 md:py-8 pl-4 md:pl-8 text-gray-300 hover:underline cursor-pointer">
                Made By:{" "}
                {proposal?.status == "Over_By_Freelancer"
                  ? trimAddress(proposal?.freelancer_address)
                  : trimAddress(proposal?.client_address)}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="py-5 border text-center flex items-center justify-center">
            <p className="font-light text-medium text-gray-200 p-2">
              {" "}
              {proposal?.reason}
            </p>
          </div>
        </div>

        {conversationsData != null ? (
          <>
            {/* <div className="w-full">
              <h1 className="font-bold text-2xl mt-10">Conversation</h1>
              <div className="flex-col w-full border mb-10 mt-10">
                <List
                  sx={{
                    height: { xs: "79vh", sm: "79vh", md: "84vh" },
                    overflowY: "auto",
                    mt: { xs: 9, sm: 9, md: "20px" },
                  }}
                >
                  <div className="w-full">
                    {conversationsData != null &&
                    conversationsData?.[0]?.messages.length > 0 ? (
                      <>
                        {conversationsData[0].messages.map((message, id) => {
                          return (
                            <ChatMessage
                              key={id}
                              message={message.text}
                              date={message.date}
                              from={message.from}
                              sentByMe={
                                message.from == proposal?.client_address
                              }
                              // freelancerData={{
                              //   ipfsImageHash:
                              //     "bafkreibwronbp5evijccjhghclp3c6gul4qtl2mb44wajx2dbclapfphia",
                              // }}
                              proposalDetailPage={true}
                            />
                          );
                        })}
                      </>
                    ) : (
                      <Typography
                        component="h5"
                        variant="h5"
                        align="center"
                        mt="40vh"
                        color="grey.400"
                      >
                        This conversation is empty
                      </Typography>
                    )}
                  </div>
                </List>
              </div>
            </div> */}
            {/* <Chat
              conversationsData={conversationsData}
              setConversationsData={setConversationsData}
              selected={selected}
              conversations={
                conversationsData?.messages
              }
              to={
                conversationsData?.[0]?.participants
              }
              setConversations={setConversations}
            // freelancerData={
            //   conversationsData.freelancer[0]
            // }
            /> */}

            <div className=" min-h-[calc(100vh-120px)] mt-20 rounded-2xl h-screen py-4 overflow-scroll ">
              {conversations != null && conversations.length > 0 ? (
                <>
                  {conversations.map((message, id) => {
                    return (
                      <Fragment key={id} className="text-white">
                        <div className="text-white">
                          {id == 0
                            ? generateDate(conversations[id]?.created_at)
                            : id > 0 &&
                              new Date(
                                conversations[id]?.created_at
                              ).getDate() -
                              new Date(
                                conversations[id - 1]?.created_at
                              ).getDate() >
                              0
                              ? generateDate(conversations[id]?.created_at)
                              : null}
                        </div>
                        {message.from ==
                          conversationsData?.freelancer_address && (
                            <MessageLeft
                              message={message.text}
                              timestamp={message.created_at}
                              // photoURL={
                              //   "https://ipfs.io/ipfs/" + freelancerData?.ipfsImageHash
                              // }
                              // avatarDisp={true}
                              displayName={trimAddress(
                                conversationsData?.freelancer_address
                              )}
                              type={message.type}
                            />
                          )}

                        {message.from == conversationsData?.client_address && (
                          <MessageRight
                            message={message.text}
                            timestamp={message.created_at}
                            // photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                            // avatarDisp={true}

                            daoFrom={trimAddress(
                              conversationsData?.client_address
                            )}
                            type={message.type}
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </>
              ) : (
                <h5 className="border-gray-200 flex align-center justify-center h-screen font-gray-200">
                  This conversation is empty
                </h5>
              )}
            </div>

            <div className="px-4 py-8 lg:px-0">
              <h1 className="font-bold text-2xl text-gray-200 my-5 mt-16 text-center">
                DAO Comments
              </h1>
              {daoMessages && daoMessages.length > 0 ? (
                daoMessages.map((message) => (
                  <div className="w-full my-2">
                    <div className="py-2 border border-gray-300 text-center flex items-center justify-center shadow-md rounded-lg backdrop-blur-lg">
                      <p className="font-light text-gray-100 ">
                        {message?.text}
                      </p>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between w-full">
                      <p className="font-light text-xs text-gray-100 p-4">
                        {message?.from}
                      </p>
                      <p className="font-light text-xs text-blue-800 p-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
              <div className="mt-5">
                <label
                  htmlFor="large-input"
                  className="block mb-2 text-sm font-medium text-gray-200 dark:text-white"
                >
                  Write your thoughts
                </label>
                <textarea
                  id="large-input"
                  className="block w-full p-2 h-32 text-gray-100 border border-gray-300 rounded-lg bg-gray-900 sm:text-md focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setMessageState(e.target.value)}
                  value={messageState}
                />
              </div>
              <button
                className="mt-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                onClick={() => sendMessage()}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div class="min-h-[calc(70vh)] flex items-center justify-center flex-col">
            <img
              src={"/empty.png"}
              alt=""
              class="w-1/2 sm:w-1/4 h-auto sm:h-1/4"
              style={{
                filter: "grayscale(1)",
              }}
            />
            <p
              class="text-center text-gray-200 font-bold mt-5 sm:mt-10"
              onClick={() => getConversations()}
            >
              Please try clicking{" "}
              <span class="text-blue-700 cursor-pointer"> here </span> or
              refreshing if you don't see the conversation history
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DaoProposalDetail;
