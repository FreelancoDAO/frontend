import React, { useEffect, useState } from "react";

import Home from "../components/landing/Home";
import ErrorBox from "../components/Validation/ErrorBox";
import { useAccount, useNetwork, useSigner } from "wagmi";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { ethers } from "ethers";
import useAuth from "../hooks/useAuth";
const abi = require("../constants/Whitelist.json");

const join = () => {
  const [errorMessage, setErrorMssage] = useState("");
  const [showError, setShowError] = useState(false);
  const [isWhiteListedAlready, setIsWhitelistedAlready] = useState(false);
  const whitelistAddress = "0x9029A785A239d34f83dd0D5Ff83a3Df239Fdb850";

  const { whitelistNFT } = useAuth();
  const { chain } = useNetwork();

  const { address, connector, isConnected } = useAccount();

  const { data: wagmiSigner, isError, isLoading } = useSigner();

  async function sendTx() {
    new Promise((res, rej) => {
      if (wagmiSigner) res(wagmiSigner);
    }).then(async (signer) => {
      console.log(chain.id==80001)
      if(chain.id==80001) {
        setShowError(true);
        setErrorMssage("Please Select Polygon Mainnet");
        return;
      };

      let contractWithSigner = whitelistNFT.connect(signer);
      try {
        let tx = await contractWithSigner.joinWhitelist({
          value: ethers.utils.parseEther("0.6"),
          gasLimit: 1000000,
        });
      } catch (e) {
        setShowError(true);
        if (e.toString().includes("rejected")) {
          setErrorMssage("User declined the action");
        } else if (e.toString().includes("deadline")) {
          setErrorMssage("Please select a date that is after today's date");
        } else {
          setErrorMssage(e.toString());
        }
      }
    });
  }

  useEffect(() => {
    const getData = async () => {
      if (wagmiSigner) {
        const contract = new ethers.Contract(
          whitelistAddress,
          abi,
          wagmiSigner
        );
        setIsWhitelistedAlready(await contract._whitelisted(address));
        console.log(await contract._whitelisted(address));
      }
    };
    getData();
  }, [wagmiSigner]);

  async function joinWaitlist() {
    if (isConnected) {
      await sendTx();
    } else {
      // setShowError(true);
      // setErrorMssage("Please Connect");
    }
  }

  return (
    <div>
      <>
      <section className="page">
      {/* overlay */}

      <div className="overlay"></div>

      <video src={"./video.mp4"} autoPlay loop muted />

      <div className="page__content">
        <h1>FreelancoDAO</h1>
        <ErrorBox
          cancel={setShowError}
          show={showError}
          errorMessage={errorMessage}
        />
        {isWhiteListedAlready && <Confetti width={800} />}

        <h3>
          We are the
          <span style={{ color: "skyblue" }}> world’s first</span> freelance
          platform to use <span style={{ color: "skyblue" }}>AI</span> as an
          arbritator using the most{" "}
          <span style={{ color: "skyblue" }}>trust-minimised technology.</span>
        </h3>
        <FlipClockCountdown
          className="flip-clock"
          to={new Date("June 1, 2023 13:30:00").getTime()}
        />
        <div className="small">
          {isWhiteListedAlready ? (
            <></>
          ) : (
            <button className="btn" onClick={() => joinWaitlist()}>
              Join whitelist
            </button>
          )}
          <button
            className="btn"
            onClick={() => {
              window.open("https://freelancodao.gitbook.io/freelancodao/");
            }}
          >
            Whitepaper
          </button>
        </div>
      </div>
    </section></>
      {/* <Home /> */}
    </div>
  );
};

export default join;
