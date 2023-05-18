import React, { useState, createContext, useContext, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { socket, connectSocket } from "../socket";
import { useRouter } from "next/router";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";

const { ethers } = require("ethers");
import {
  useSigner,
} from "wagmi";

const context = createContext();
const { Provider } = context;

const chainIdToNetwork = {
  1: "Mainnet",
  5: "Goerli",
  31337: "Hardhat",
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState();
  const [isSellerYet, setIsSellerYet] = useState(false);
  const [userProposals, setUserProposals] = useState([]);
  const [signer, setSigner] = useState(undefined);
  const [chainId, setChainID] = useState(undefined);
  const [network, setNetwork] = useState(undefined);
  const [provider, setProvider] = useState(undefined);
  const [asSeller, setAsSeller] = useState(false);
  const [skills, setSkills] = useState(["C++", "Python", "Tailwind", "AI/ML"]);
  const [currentFreelancerData, setCurrentFreelancerData] = useState(undefined);
  const [freelancerCompletenes, setCompleteness] = useState(undefined);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(undefined);
  const [searchedGigs, setSearchedGigs] = useState([]);
  const [newMessageCount, setNewMessageCount] = useState(new Set());
  const [isWrongNetwork, setIsWrongNetwork] = useState(undefined);
  const [web3auth, setWeb3auth] = useState(null);
  const router = useRouter();
  const { data: signers, isError, isLoading } = useSigner();

  console.log("signer...........................", signer);
  // console.log(user, "...........................it's working");

  async function setValues() {
    console.log("ether", window.ethereum);
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      setSigner(provider.getSigner());
      setIsLoggedIn(true);
      setChainID(window.ethereum.networkVersion);
      if (parseInt(window.ethereum.networkVersion) === 80001) {
        setIsWrongNetwork(false);
      }
      setNetwork(chainIdToNetwork[chainId]);
      localStorage.setItem("isWalletConnected", true);

    }
  }

  // const clientId = 'BAL307ODg2OdZPSKPDgSwrM45HW9OSGc - HuDjprjBOuUs2a_Cdl8i5IkQ1p--istRuE-UEwyiOOCeDIjwWocCZQ';


  // const initWeb3AuthSigner = async () => {
  //   try {
  //     const web3auth = new Web3Auth({
  //       clientId,
  //       chainConfig: {
  //         chainNamespace: CHAIN_NAMESPACES.EIP155,
  //         chainId: "0x13881",
  //         rpcTarget: "https://rpc-mumbai.maticvigil.com/",
  //       },
  //     });

  //     setWeb3auth(web3auth);

  //     await web3auth.initModal();
  //     const provider = await web3auth.connect();
  //     const signer = new ethers.providers.Web3Provider(provider).getSigner();
  //     setSigner(signer);

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("chainChanged", (e) => {
        setChainID(parseInt(e));
        if (parseInt(e) === 80001) {
          setIsWrongNetwork(false);
        } else {
          setIsWrongNetwork(true);
        }
      });
    }
  });


  useEffect(() => {
    // initWeb3AuthSigner();
    setValues();
  }, [user]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      setToken(token);
      const decodedToken = jwt_decode(token);
      const user = decodedToken.data.user;
      setUser(user);
      setIsLoggedIn(true);
      setValues();
    }
    else {
      setIsLoggedIn(false);
    }
  }, []);


  return (
    <Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        token,
        setToken,
        isSellerYet,
        userProposals,
        setUserProposals,
        asSeller,
        setAsSeller,
        signer,
        setSigner,
        network,
        chainId,
        setChainID,
        provider,
        skills,
        currentFreelancerData,
        setCurrentFreelancerData,
        freelancerCompletenes,
        setCompleteness,
        isWrongNetwork,
        setIsWrongNetwork,
        search,
        setSearch,
        setValues,
        theme,
        setTheme,
        searchedGigs,
        setSearchedGigs,
        newMessageCount,
        setNewMessageCount,
        web3auth,
        setWeb3auth,
        setProvider
      }}
    >
      {children}
    </Provider>
  );
};

const useAuth = () => useContext(context);

export default useAuth;
