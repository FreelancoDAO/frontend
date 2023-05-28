import React, { useState, useEffect } from "react";
// import jwt_decode from "jwt-decode";
// import { loginUser, profile, validateUser } from "../api/auth";
import useAuth from "../../hooks/useAuth";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import RPC from "./web3RPC";
// import Web3 from "web3";
import { useRouter } from "next/router";
import { ethers } from "ethers";

import {
  useAccount,
  useConnect,
  useSignMessage,
  useDisconnect,
  useNetwork,
  useSigner,
  ConnectorAlreadyConnectedError,
} from "wagmi";
import { requestMessage, verifySignature, socialLogin } from "../../api/auth";

import jwt_decode from "jwt-decode";
import ErrorBox from "../Validation/ErrorBox";
import TxBox from "../Validation/TxBox";

const LoginForm = ({ setWantsToLogin }) => {
  const router = useRouter();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [showTxDialog, setShowTxDialog] = useState(false);
  const [txMessage, setTxMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { chain } = useNetwork();

  const {
    isLoggedIn,
    user,
    setIsLoggedIn,
    setToken,
    isSellerYet,
    setUser,
    AsSeller,
    setAsSeller,
    chainId,
    isWrongNetwork,
    setValues,
    web3auth,
    setProvider,
    setChainID,
    setSigner
  } = useAuth();



  const [userData, setUserData] = useState({});
  // console.log("web3auth", web3auth);

  // useEffect(() => {
  //   const init = async () => {
  //     console.log("hii");
  //     try {
  //       const web3auth = new Web3Auth({
  //         clientId,
  //         chainConfig: {
  //           chainNamespace: CHAIN_NAMESPACES.EIP155,
  //           chainId: "0x13881",
  //           rpcTarget: "https://rpc-mumbai.maticvigil.com/",
  //         },
  //       });

  //       setWeb3auth(web3auth);
  //       await web3auth.initModal();
  //       setProvider(web3auth.provider);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   init();
  // }, []);

  // const social_login = async () => {
  //   if (!web3auth) {
  //     console.log("web3auth not initialized yet");
  //     return;
  //   }
  //   const web3authProvider = await web3auth.connect();
  //   const signer = new ethers.providers.Web3Provider(web3authProvider).getSigner();
  //   console.log("signerrr", signer);
  //   setSigner(signer);
  //   // Get the current user's address
  //   const userAddress = await signer.getAddress();
  //   setProvider(web3authProvider);
  //   const user = await web3auth.getUserInfo();
  //   setUserData(user);
  //   const rpc = new RPC(web3authProvider);
  //   const private_Key = await rpc.getPrivateKey();
  //   const chain = await rpc.getChainId();
  //   console.log("ccccc", chain);
  //   setChainID(chain);
  //   const wallet_address = new ethers.Wallet(private_Key);
  //   const user_details = { ...user, private_Key, wallet_address: wallet_address?.address, socialLogin: true }
  //   const result = await socialLogin(user_details);
  //   const token = result.token;
  //   localStorage.setItem("token", token);
  //   router.push("/explore");
  //   setIsLoggedIn(true);
  //   setToken(result.token);
  //   setUser(result.user);
  //   setValues();
  // };

  // const getUserInfo = async () => {
  //   if (!web3auth) {
  //     console.log("web3auth not initialized yet");
  //     return;
  //   }
  //   const user = await web3auth.getUserInfo();
  //   setUserData(user);
  //   console.log("userData",user);
  // };





  const connectAndSign = async () => {
    setIsLoading(true);
    //disconnects the web3 provider if it's already active
    // if (isConnected) {
    //   await disconnectAsync();
    // }
    // enabling the web3 provider metamask
    // const { account, chain } = await connectAsync({
    //   connector: new InjectedConnector(),
    // });

    setTxMessage("requesting signature from server.....");
    setShowTxDialog(true);
    try {
      const userData = { address: address, chain: chain.id, network: "evm" };
      // making a post request to our 'request-message' endpoint
      const data = await requestMessage(userData);
      const message = data.message;

      // signing the received message via metamask
      const signature = await signMessageAsync({ message });
      setIsLoading(true);
      setTxMessage("verifying signature.....");
      const verification_data = { message, signature };
      const result = await verifySignature(verification_data);

      console.log(result, "result from signin ");
      const token = result.token;
      localStorage.setItem("token", token);
      router.push("/explore");
      setIsLoggedIn(true);
      setToken(result.token);
      setUser(result.user);
      setValues();
      setShowTxDialog(false);
    } catch (e) {
      setShowErrorDialog(true);
      setIsLoading(false);
      setErrorMessage("You are not a member");
      if (e.toString().includes("rejected")) {
        setErrorMessage("User declined the action");
      } else if (e.toString().includes("deadline")) {
        setErrorMessage("Please select a date that is after today's date");
      } else {
        setErrorMessage(e.toString());
      }
    }
    // console.log(jwt_decode(result.token));
  };
  console.log("address------------", address, "chain-----------------", chain);
  const { push } = useRouter();

  return (
    <div className="flex flex-col ml-20 mt-40 font-bold">
      
      
      <h1 className="text-7xl font-black text-white">Log in</h1>
      <p className="mt-2 text-white text-sm font-light">
        Enter your credentials to access your account.
      </p>
      <form
        className="flex flex-col mt-20"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label htmlFor="email" className="text-sm font-semibold text-white">
          Wallet
        </label>
        <input
          type="text"
          disabled={true}
          placeholder={address ? String(address) : "Connect your wallet"}
          className="placeholder:italic placeholder:text-slate-100 block bg-gray-900 bg-opacity-5 h-12 my-2 w-3/4 border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-white"
        />
        {address &&
          (!isWrongNetwork ? (
            <>
              {isLoading ? (
                <div className="flex w-3/4justify-end mt-5 mx-5">
                  <img
                    src="loading.gif"
                    height={80}
                    width={80}
                  />
                </div>
              ) : (
                <button
                  // href="/explore"
                  onClick={() => connectAndSign()}
                  className="w-3/4 p-4 cursor-pointer border border-white rounded-2xl my-4  py-2 text-white font-extrabold"
                >
                  Sign In
                </button>
              )}
            </>
          ) : (
            <span className="w-3/4 p-4 cursor-pointer border border-blue-800 rounded-2xl my-4  py-2 text-blue-800 font-extrabold">
              Please reconnect to Polygon Mumbai network.
            </span>
          ))}
        {/* <>
          <p className="w-3/4 p-4  my-2 text-center py-2 text-white font-light">or</p>
          <button
            // href="/explore"
            onClick={() => social_login()}
            className="w-3/4 p-4 cursor-pointer border border-white rounded-2xl my-4  py-2 text-white font-light"
          >
            Social Login
          </button>
        </> */}
      </form>
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
      // routeToPush={"/client-profile"}
      />
      </div>
    </div>
  );
};

export default LoginForm;
