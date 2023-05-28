import { useEffect, useReducer, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/router";
import { socket } from "../../socket";
import Image from "next/image";
import { MessageLeft, MessageRight } from "./Message";
// import AttachFileIcon from '@mui/icons-material/AttachFile';
import TextInput from "./TextInput";
import { Fragment } from "react";

function Chat({
  conversationsData,
  setConversationsData,
  selected,
  conversations,
  to,
  freelancerData,
}) {
  const { user, newMessageCount } = useAuth();
  const router = useRouter();
  const refc = useRef();
  const fileInputRef = useRef(null);
  const [messageState, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const [freelancerAddr, setFreelancerAddr] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const initialState = {
    messages: conversations || [],
  };
  useEffect(() => {
    let element = document.getElementById(`list${user.wallet_address}`);
    element.scrollTop = element.scrollHeight;
  });
  useEffect(() => {
    if (conversations) {
      dispatch({ type: "SET_INITIAL_MESSAGES", payload: conversations });
    }
  }, [conversations]);

  console.log("new message...", newMessageCount);
  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_MESSAGE":
        return {
          ...state,
          messages: [...state.messages, action.payload],
        };
      case "SET_INITIAL_MESSAGES":
        return {
          messages: action.payload,
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (conversationsData) {
      for (let i = 0; i < conversationsData.length; i++) {
        let c = conversationsData[i];
        if (c._id == selected) {
          c.messages = state.messages;
        }
      }
      setConversationsData(conversationsData);
    }
  }, [state]);

  useEffect(() => {
    if (router.query.address) {
      const freelancer_address = router.query.address;

      setFreelancerAddr(freelancer_address);
    }
  }, [router, conversations]);

  const ref = useRef(null);

  function handleIconClick() {
    fileInputRef.current.click();
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const sendMessage = () => {
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        const arrayBuffer = reader.result;
        const buffer = Buffer.from(arrayBuffer);

        socket.emit(
          "file_message",
          {
            mimetype: file.type,
            filename: file.name,
            buffer: buffer,
          },
          (location) => {
            setFile(null);
            console.log("location", location);
            const message = {
              message: location,
              conversation_id: selected,
              from: user.wallet_address,
              to: to.filter((addr) => addr !== user.wallet_address)[0],
              type: "Link",
            };
            if (socket) {
              socket.emit("text_message", message);
              setMessage("");
              ref.current.focus();
            }
          }
        );
      };
    } else {
      const message = {
        message: messageState,
        conversation_id: selected,
        from: user.wallet_address,
        to: to.filter((addr) => addr !== user.wallet_address)[0],
        type: "Text",
      };
      if (socket) {
        socket.emit("text_message", message);
        setMessage("");
        ref.current.focus();
      }
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("new_message", (data) => {
        // Check if incoming data has a unique createdAt value
        if (selected === data.conversation_id) {
          // Update lastCreatedAt to current value
          // refc.scrollTop = refc.scrollHeight;
          dispatch({ type: "ADD_MESSAGE", payload: data.message });
        }
        // else {
        //   setNewMessageCount((prevSet) => {
        //     const newSet = new Set(prevSet);
        //     newSet.add(data.conversation_id);
        //     return newSet;
        //   });
        // }
      });
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("new_message");
      }
    };
  }, [selected]);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Do something when the Enter key is pressed
      sendMessage();
      console.log("Enter key pressed!");
    }
  };

  function titleCase(str) {
    if (str != null && str.split(" ").length > 1) {
      str = str.toLowerCase().split(" ");
      for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
      }
      return str.join(" ");
    } else {
      str = str.charAt(0).toUpperCase() + str.substring(1);
      return str;
    }
  }

  function reduceWalletAddress(address) {
    const firstChars = address.slice(0, 6);
    const lastChars = address.slice(-4);
    return `${firstChars}...${lastChars}`;
  }

  const generateDate = (date) => {
    return (
      <div style={{ textAlign: "center" }}>
        {new Date(date).toLocaleDateString()}
      </div>
    );
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

  return (
    // <div className="shadow ">
    <div className="border-gray-900 rounded-2xl mr-10">
      <div className="w-full  sm:items-center justify-between border-gray-200">
        {freelancerData ? (
          <div
            className="relative flex items-center"
          // style={{ backgroundColor: "whitesmoke" }}
          >
            <div className="relative">
              <Image
                className="w-10 sm:w-16 h-10 sm:h-16 rounded-full ml-2 p-1"
                src={"https://ipfs.io/ipfs/" + freelancerData?.ipfsImageHash}
                alt="product image"
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col ml-5 leading-tight text-white">
              <div className="text-2xl mt-1 flex items-center">
                <h3 className="text-white">
                  {freelancerData?.name
                    ? titleCase(freelancerData?.name)
                    : undefined}
                </h3>
              </div>
              <span className="mb-2 text-xs font-bold tracking-tight text-white">
                {width > 1000
                  ? freelancerData?.wallet_address
                  : reduceWalletAddress(freelancerData?.wallet_address)}
              </span>
              {freelancerData?.isTopRated && (
                <p className="text-blue-800 text-xs">Top Rated Seller</p>
              )}
            </div>
          </div>
        ) : (
          <div
            className="relative flex items-center"
          // style={{ backgroundColor: "whitesmoke" }}
          >
            <div className="relative">
              <img
                className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                src={"https://cryptologos.cc/logos/polygon-matic-logo.png"}
                alt="product image"
                width={50}
                height={50}
              />
            </div>
            <div className="flex-col ml-5">
              <p className="font-bold text-md hover:underline cursor-pointer text-white">
                {to[0] != user?.wallet_address
                  ? width > 1000
                    ? to[0]
                    : reduceWalletAddress(to[0])
                  : width > 1000
                    ? to[1]
                    : reduceWalletAddress(to[1])}{" "}
              </p>
            </div>
          </div>
        )}
      </div>
      <div
        ref={refc}
        id={"list" + user.wallet_address}
        className="flex flex-col p-3 overflow-y-scroll scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        style={{ height: "66vh" }}
      >
        {state.messages.length > 0 ? (
          <>
            {state.messages.map((message, id) => {
              return getTimeDisplayCondition(state.messages, id) ? (
                <Fragment key={id} className="text-white">
                  <div className="text-white">
                    {id == 0
                      ? generateDate(state.messages[id]?.created_at)
                      : id > 0 &&
                        new Date(state.messages[id]?.created_at).getDate() -
                        new Date(
                          state.messages[id - 1]?.created_at
                        ).getDate() >
                        0
                        ? generateDate(state.messages[id]?.created_at)
                        : null}
                  </div>
                  {message.from != user?.wallet_address && (
                    <MessageLeft
                      message={message.text}
                      timestamp={message.created_at}
                      photoURL={
                        freelancerData?.awsImageLink
                      }
                      avatarDisp={true}
                      displayName={
                        freelancerData?.name
                          ? titleCase(freelancerData?.name)
                          : reduceWalletAddress(user.wallet_address)
                      }
                      type={message.type}
                    />
                  )}

                  {message.from == user?.wallet_address && (
                    <MessageRight
                      message={message.text}
                      timestamp={message.created_at}
                      photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                      avatarDisp={true}
                      type={message.type}
                    />
                  )}
                </Fragment>
              ) : (
                <Fragment key={id}>
                  {message.from != user?.wallet_address && (
                    <MessageLeft
                      message={message.text}
                      timestamp={null}
                      photoURL={
                        freelancerData?.awsImageLink
                      }
                      avatarDisp={true}
                      displayName={
                        freelancerData?.name
                          ? titleCase(freelancerData?.name)
                          : reduceWalletAddress(user.wallet_address)
                      }
                      type={message.type}
                    />
                  )}

                  {message.from == user?.wallet_address && (
                    <MessageRight
                      message={message.text}
                      timestamp={null}
                      photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                      avatarDisp={true}
                      type={message.type}
                    />
                  )}
                </Fragment>
              );
            })}
          </>
        ) : conversations != null && conversations.length > 0 ? (
          <>
            {conversations.map((message, id) => {
              return getTimeDisplayCondition(state.messages, id) ? (
                <Fragment key={id}>
                  {id == 0
                    ? generateDate(state?.messages[id]?.created_at)
                    : id > 0 &&
                      new Date(state.messages[id]?.created_at).getDate() -
                      new Date(state.messages[id - 1]?.created_at).getDate() >
                      0
                      ? generateDate(state.messages[id]?.created_at)
                      : null}
                  {message.from != user?.wallet_address && (
                    <MessageLeft
                      message={message.text}
                      timestamp={message.created_at}
                      photoURL={
                        freelancerData?.awsImageLink
                      }
                      avatarDisp={true}
                      type={message.type}
                    />
                  )}

                  {message.from == user?.wallet_address && (
                    <MessageRight
                      message={message.text}
                      timestamp={message.created_at}
                      photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                      avatarDisp={true}
                      displayName={titleCase(freelancerData?.name)}
                      type={message.type}
                    />
                  )}
                </Fragment>
              ) : (
                <Fragment key={id}>
                  {message.from != user?.wallet_address && (
                    <MessageLeft
                      message={message.text}
                      timestamp={null}
                      photoURL={
                        freelancerData?.awsImageLink
                      }
                      avatarDisp={true}
                      type={message.type}
                    />
                  )}

                  {message.from == user?.wallet_address && (
                    <MessageRight
                      message={message.text}
                      timestamp={null}
                      photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                      avatarDisp={true}
                      displayName={titleCase(freelancerData?.name)}
                      type={message.type}
                    />
                  )}
                </Fragment>
              );
            })}
          </>
        ) : (
          <h5 className="border-gray-200 flex align-center justify-center h-screen text-white">
            This conversation is empty
          </h5>
        )}
      </div>
      {/* {file && <img src={URL.createObjectURL(file)} style={{ height: "300px", width: "auto" }} />} */}
      <div className="sm:mb-0" style={{ height: "8vh" }}>
        <div className="relative flex">
          <input
            disabled={file}
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={messageState}
            ref={ref}
            onKeyDown={handleKeyDown}
            placeholder="Write your message!"
            className="w-full border-0.5 border-white mx-2 focus:outline-none  bg-transparent transition-all duration-500 text-white focus:placeholder-gray-400 placeholder-gray-600 pl-12 rounded-md py-3"
          // style={{ boxShadow: "6px 10px 37px 8px rgba(0,0,0,0.75)" }}
          />
          <div className="absolute right-0 items-center inset-y-0  sm:flex">
            {/* <AttachFileIcon />
              <input
                // className={inputSelector}
                type="file"
                onChange={handleFileChange}
              /> */}
            <div>
              {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <g> <path fill="none" d="M0 0h24v24H0z" /> <path d="M14.828 7.757l-5.656 5.657a1 1 0 1 0 1.414 1.414l5.657-5.656A3 3 0 1 0 12 4.929l-5.657 5.657a5 5 0 1 0 7.071 7.07L19.071 12l1.414 1.414-5.657 5.657a7 7 0 1 1-9.9-9.9l5.658-5.656a5 5 0 0 1 7.07 7.07L12 16.244A3 3 0 1 1 7.757 12l5.657-5.657 1.414 1.414z" /> </g> </svg> */}
              {/* <AttachFileIcon onClick={handleIconClick} /> */}
              <img
                src={"attachment.svg"}
                onClick={handleIconClick}
                className="mx-3 cursor-pointer"
                height={"30px"}
                width={"30px"}
                alt="attach"
              />
              <input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </div>
            <button
              type="button"
              onClick={() => sendMessage()}
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white focus:outline-none"
            >
              <span className="font-bold">Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6 ml-2 transform rotate-90"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default Chat;
