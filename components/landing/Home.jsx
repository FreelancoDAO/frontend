import Image from "next/image";
import { useRouter } from "next/router";
import { ethers } from "ethers";

import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

import ErrorBox from "../Validation/ErrorBox";
import TxBox from "../Validation/TxBox";
import { useNetwork, useSigner } from "wagmi";
const {
  contractAddresses,
  whitelist_abi,
} = require("../../constants");

export function Countdown() {
  const [countdown, setCountdown] = useState({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const futureDate = new Date("May 15, 2023 00:00:00").getTime();
      const distance = futureDate - now;

      if (distance < 0) {
        clearInterval(intervalId);
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="data flex flex-row items-center justify-center md:justify-start gap-8">
      <div className="dataTab text-center">
        <h2 className="text-2xl md:text-4xl text-white font-bold">
          {countdown.hours?.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
          })}
        </h2>
        <h5 className="text-lg text-gray-400">Hours</h5>
      </div>
      <div className="dataTab text-center">
        <h2 className="text-2xl md:text-4xl text-white font-bold">
          {countdown.minutes?.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
          })}
        </h2>
        <h5 className="text-lg text-gray-400">Minutes</h5>
      </div>
      <div className="dataTab text-center">
        <h2 className="text-2xl md:text-4xl text-white font-bold">
          {countdown.seconds?.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
          })}
        </h2>
        <h5 className="text-lg text-gray-400">Seconds</h5>
      </div>
    </div>
  );
}

export const Button = ({ text }) => {
  const { signer, chainId } = useAuth();
  const { chain } = useNetwork();

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showTxDialog, setShowTxDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [txMessage, setTxMessage] = useState(undefined);
  // const { data: signer, isError, isLoading } = useSigner();
  const [whitelistNFT, setWhitelistNFT] = useState(undefined);

  useEffect(()=>{
      if (contractAddresses.Whitelist[chainId]?.[0]) {
        const whitelist = new ethers.Contract(
          contractAddresses["Whitelist"][chainId][0],
          whitelist_abi,
        );
       setWhitelistNFT(whitelist);
      }
      },[chainId])

  const router = useRouter();
  return (
    <>
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
      <button
        className="bg-transparent border text-white font-bold py-2 px-4 rounded-full transition duration-200"
        onClick={async () => {
          if (String(text) == "Explore") {
            router.push("/explore");
          } else if (String(text) == "Learn More") {
            window.open(
              "https://freelancodao.gitbook.io/freelancodao/",
              "_blank"
            );
          } else {
            if (chainId != 137) {
              setErrorMessage("Please connect to Polygon Mainnet");
              setShowErrorDialog(true);
            } else {
              try {
                if (!signer) {
                  throw new Error("please connect your wallet");
                }
                let contractWithSigner = whitelistNFT.connect(signer);
                let tx = await contractWithSigner.joinWhitelist({
                  value: BigInt("1300000000000000000"),
                });
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
                  setErrorMessage(
                    "Please select a date that is after today's date"
                  );
                } else {
                  setErrorMessage(e.toString());
                }
                setShowErrorDialog(true);
              }
            }
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 inline-block mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
        {text}
      </button>
    </>
  );
};

export default function Home() {
  return (
    <section className="relative overflow-hidden bg-gray-900 rounded-lg md:m-0.5 md:mb-5">
      {/* <Navbar /> */}
      <div className="absolute bottom-0 left-0 z-0 w-[80vw] h-[80vh] bg-blue-800 rounded-full blur-2xl opacity-50 transform translate-x-8 translate-y-1/4"></div>
      <div className="container flex mt-20 h-[89vh] flex-col items-center justify-center md:flex-row">
        <div className="z-10 flex flex-col items-center justify-center w-full md:w-2/3 xl:w-1/2 px-6 md:px-12">
          <h1 className="text-5xl mt-10 md:text-6xl text-white font-bold text-center mb-4">
            Join Our{" "}
            <span>
              {/* <img
                className="h-6 inline-block mx-1"
                src={heroText}
                alt="Hero Text"
              /> */}
            </span>
            Whitelist <br />
          </h1>
          <h1></h1>
          {/* <p className="text-gray-400 text-lg text-center mb-8">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.
          </p> */}
          <div className="flex flex-col items-center justify-center w-full md:w-auto">
            <div className="buttons flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-8 mb-8 md:mb-20">
              <Button blue text="Join now" />
              <Button text="Learn More" />
            </div>
            <a
              target="_blank"
              href="https://polygonscan.com/address/0xb8473FcF51a227158ae773fe8AbeF29DbCEA04AE#code"
              className="text-xs text-white border cursor-pointer hover:text-blue-200 p-2 rounded-2xl px-4 mb-2"
            >
              See Contract
            </a>

            <div className="data flex flex-row items-center justify-center md:justify-start gap-8">
              <h1 className="text-2xl md:text-4xl text-blue-200 font-bold mb">
                Presale starting in
              </h1>
            </div>

            {/* <div className="data flex flex-row items-center justify-center md:justify-start gap-8">
              <div className="dataTab text-center">
                <h2 className="text-2xl md:text-4xl text-white font-bold">
                  40
                </h2>
                <h5 className="text-lg text-gray-400">Hours</h5>
              </div>
              <div className="dataTab text-center">
                <h2 className="text-2xl md:text-4xl text-white font-bold">
                  12
                </h2>
                <h5 className="text-lg text-gray-400">Minutes</h5>
              </div>
              <div className="dataTab text-center">
                <h2 className="text-2xl md:text-4xl text-white font-bold">
                  20
                </h2>
                <h5 className="text-lg text-gray-400">Seconds</h5>
              </div>
            </div> */}
            <Countdown />
          </div>
        </div>
        <div className="flex w-full items-center justify-center md:w-1/3 xl:w-1/2 md:h-auto">
          <Image
            className="w-[60vw] h-lg object-cover object-center rounded-3xl opacity-80 lg:ml-20"
            src="/nft.png"
            width={500}
            height={500}
            alt="Hero Image"
            style={{
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
