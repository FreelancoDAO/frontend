import { useEffect, useReducer, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/router";
import { socket } from "../../socket";
import { Box, Fab, List, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { MessageLeft, MessageRight } from "./Message";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextInput from "./TextInput";
import { Fragment } from "react";


const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      width: "80vw",
      height: "80vh",
      maxWidth: "500px",
      maxHeight: "700px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"
    },
    paper2: {
      width: "80vw",
      maxWidth: "500px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"
    },
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      overflowY: "scroll",
      height: "calc( 100% - 80px )"
    }
  })
);

function Chat({ selected, conversations, to, freelancerData }) {
  const { user } = useAuth();
  const router = useRouter();
  const refc = useRef();
  const [messageState, setMessage] = useState("");

  const [freelancerAddr, setFreelancerAddr] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const initialState = {
    messages: conversations || [],
  };
  useEffect(()=>{
    let element = document.getElementById(`list${user.wallet_address}`);
    element.scrollTop = element.scrollHeight;
  })
  useEffect(() => {
    if (conversations) {
      dispatch({ type: "SET_INITIAL_MESSAGES", payload: conversations });
    }
  }, [conversations])

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
    if (router.query.address) {
      const freelancer_address = router.query.address;

      setFreelancerAddr(freelancer_address);
    }
  }, [router, conversations]);

  const ref = useRef(null);

  const sendMessage = () => {
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
    if(str!=null && str.split(' ').length>1){
      str = str.toLowerCase().split(' ');
      for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
      }
      return str.join(' ');
    }else{
      str = str.charAt(0).toUpperCase()+str.substring(1);
      return str;
    }
  }

  function reduceWalletAddress(address) {
    const firstChars = address.slice(0, 6);
    const lastChars = address.slice(-4);
    return `${firstChars}...${lastChars}`;
  }

  const generateDate = (date)=>{
    return(
      <div style={{"textAlign":"center"}}>{new Date(date).toLocaleDateString()}</div>
    )
  }
  const getTimeDisplayCondition = (messages,id)=>{
    if(messages.length>1){
      let currentTime = new Date(messages[id].created_at).getMinutes();
      if(id==0){
        return true;
      }else if(id>0 && id!=messages.length-1){
        let prevTime = new Date(messages[id-1].created_at).getMinutes();
        let nextTime = new Date(messages[id+1].created_at).getMinutes();
        if(messages[id].from==messages[id-1].from && prevTime==currentTime){
          return false;
        }else{
          return true;
        }
      }
    }
    return true;
  }

  return (
    // <div className="shadow ">
    <div className="border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
      <div className="w-full  sm:items-center justify-between border-gray-200">
        {freelancerData ? (
          <div className="relative flex items-center" style={{"backgroundColor":"whitesmoke"}}>
            <div className="relative">
            <Image
              className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
              src={"https://ipfs.io/ipfs/" + freelancerData?.ipfsImageHash}
              alt="product image"
              width={50}
              height={50}
            />
            </div>
            <div className="flex flex-col ml-5 leading-tight">
              <div className="text-2xl mt-1 flex items-center">
                <h3>{freelancerData?.name?titleCase(freelancerData?.name):undefined}</h3>
              </div>
              <span className="mb-2 text-xs font-bold tracking-tight text-gray-500">
                {width>1000 ? freelancerData?.wallet_address:reduceWalletAddress(freelancerData?.wallet_address)}
              </span>
              {freelancerData?.isTopRated && (
                <p className="text-blue-800 text-xs">Top Rated Seller</p>
              )}
            </div>
          </div>
        ) : (
          <div className="relative flex items-center" style={{"backgroundColor":"whitesmoke"}}>
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
              <p className="font-bold text-md hover:underline cursor-pointer">
                {to[0] != user?.wallet_address ? (width>1000 ? to[0] :reduceWalletAddress(to[0])) : (width>1000 ? to[1] :reduceWalletAddress(to[1]))}{" "}
              </p>
            </div>
          </div>
        )}
      </div>
      <List 
        ref={refc}
        id={"list"+user.wallet_address}
        className="flex flex-col p-3 overflow-y-scroll scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        style={{"height":"66vh"}}
      >
        {state.messages.length > 0 ? (
          <>
            {state.messages.map((message, id) => {
              return (
                getTimeDisplayCondition(state.messages,id)?
                  <Fragment key={id}>
                  {id==0?(generateDate(state.messages[id].created_at)):id>0 && (new Date(state.messages[id].created_at).getDate())-(new Date(state.messages[id-1].created_at).getDate())>0?
                  (generateDate(state.messages[id].created_at)):null
                  }
                    {message.from != user?.wallet_address &&
                      <MessageLeft

                      message={message.text}
                      timestamp={message.created_at}
                      photoURL={"https://ipfs.io/ipfs/" + freelancerData?.ipfsImageHash}
                      avatarDisp={true}
                        displayName={freelancerData?.name?titleCase(freelancerData?.name):reduceWalletAddress(user.wallet_address)}
                        />}

                    {message.from == user?.wallet_address &&
                      <MessageRight
                        message={message.text}
                        timestamp={message.created_at}
                        photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                        avatarDisp={true}
                      />
                    }
                  </Fragment>
                :
                <Fragment key={id}>
                {message.from != user?.wallet_address &&
                  <MessageLeft
                  message={message.text}
                  timestamp={null}
                  photoURL={"https://ipfs.io/ipfs/" + freelancerData?.ipfsImageHash}
                  avatarDisp={true}
                    displayName={freelancerData?.name?titleCase(freelancerData?.name):reduceWalletAddress(user.wallet_address)}
                    />}

                {message.from == user?.wallet_address &&
                  <MessageRight
                    message={message.text}
                    timestamp={null}
                    photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                    avatarDisp={true}
                  />
                }
              </Fragment>
              );
            })}
          </>
        ) : conversations != null && conversations.length > 0 ? (
          <>
            {conversations.map((message, id) => {
              return (
                getTimeDisplayCondition(state.messages,id)?
                <Fragment key={id}>
                  {id==0?(generateDate(state.messages[id].created_at)):id>0 && (new Date(state.messages[id].created_at).getDate())-(new Date(state.messages[id-1].created_at).getDate())>0?
                  (generateDate(state.messages[id].created_at)):null
                  }
                  {message.from != user?.wallet_address &&
                    <MessageLeft
                      message={message.text}
                      timestamp={message.created_at}
                      photoURL={"https://ipfs.io/ipfs/" + freelancerData?.ipfsImageHash}
                      avatarDisp={true}
                    />}

                  {message.from == user?.wallet_address &&
                    <MessageRight
                      message={message.text}
                      timestamp={message.created_at}
                      photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                      avatarDisp={true}
                      displayName={titleCase(freelancerData?.name)}
                    />
                  }
                </Fragment>
                :<Fragment key={id}>
                {message.from != user?.wallet_address &&
                  <MessageLeft
                    message={message.text}
                    timestamp={null}
                    photoURL={"https://ipfs.io/ipfs/" + freelancerData?.ipfsImageHash}
                    avatarDisp={true}
                  />}

                {message.from == user?.wallet_address &&
                  <MessageRight
                    message={message.text}
                    timestamp={null}
                    photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                    avatarDisp={true}
                    displayName={titleCase(freelancerData?.name)}
                  />
                }
              </Fragment>
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
      </List>

      <div className="border-t-2 border-gray-200 sm:mb-0" style={{"height":"8vh"}}>
        
        <div  className="relative flex">

            <input type="text" onChange={(e) => setMessage(e.target.value)}
              value={messageState}
              ref={ref}
              onKeyDown={handleKeyDown}
              placeholder="Write your message!" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
              />
              <div className="absolute right-0 items-center inset-y-0  sm:flex">
              <button type="button"  onClick={() => sendMessage()} className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
               <span className="font-bold">Send</span>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
               </svg>
            </button>
            </div>
        </div>
         
            {/* <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-full-name"
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              value={messageState}
              ref={ref}
              onKeyDown={handleKeyDown}
            /> */}
          {/* <Box
            sx={{
              width: { xs: "32%", sm: "32%", md: "20%" },
              display: "flex",
              justifyContent: "left",
              marginLeft: "10px",
            }}
          >
            <p
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={() => sendMessage()}
            >
              Send
            </p>
          </Box>
        </Box> */}
      </div>
    </div>
    // </div>
  );
}

export default Chat;
