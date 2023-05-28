import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { requestMessage, verifySignature } from "../../api/auth";
import { getNotification } from "../../api/notification";
import NotificationList from "../notification";

import jwt_decode from "jwt-decode";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import useAuth from "../../hooks/useAuth";
import ErrorBox from "../Validation/ErrorBox";
import {
  useAccount,
  useConnect,
  useSignMessage,
  useDisconnect,
  useNetwork,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { getGigBySearch } from "../../api/gig";

const NavBar = () => {
  const router = useRouter();
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
    theme,
    searchedGigs,
    setSearchedGigs,
    setProvider,
    web3auth
  } = useAuth();

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { address, isConnecting, isDisconnected } = useAccount()

  useEffect(() => {
    if (user) {
      if (address != user.wallet_address) {
        setIsLoggedIn(false);
        console.log("LOGGED OUT");
        setShowErrorDialog(true);
        setErrorMessage("You logged out");
        localStorage.removeItem("token");

        router.push("/login");
        setUser(null);
      }
    }
  }, [address])

  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  // const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const getNotifications = async () => {
    const notifications = await getNotification();
    setNotifications(notifications);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const { chain } = useNetwork();

  const isDarkPage = true;
  // router.pathname === "/" ||
  // router.pathname === "/dao" ||
  // router.pathname.includes("/dao-home") ||
  // router.pathname === "/join" ||
  // router.pathname == "/settings";

  // let isDarkPage = theme == "dark";

  const isSignInPage =
    router.pathname === "/login" ||
    router.pathname == "/dao-login" ||
    router.pathname == "/checkout" ||
    router.pathname == "/freelancer" ||
    router.pathname == "/join";
  const isSearchPage =
    router.pathname === "/gigs" || router.pathname == "/explore";

  const [colorChange, setColorchange] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setColorchange(true);
    } else {
      setColorchange(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    if (web3auth) {
      await web3auth.logout();
    }
    router.push("/login");
    setUser(null);
    setIsLoggedIn(false);
  };

  // RainbowKit.onWalletChange(async (wallet) => {
  //   connectAndSign();
  //   // const data = await response.json();
  // });

  useEffect(() => window.addEventListener("scroll", changeNavbarColor));

  const searchGigs = async () => {
    if (navSearch) {
      const res = await getGigBySearch(navSearch);
      if (
        res.filter((r) => {
          if (user) {
            return r.freelancer.wallet_address !== user.wallet_address;
          } else {
            return r;
          }
        }).length > 0
      ) {
        setSearchedGigs(
          res.filter((r) => {
            if (user) {
              return r.freelancer.wallet_address !== user.wallet_address;
            } else {
              return r;
            }
          })
        );
      } else {
        setSearchedGigs("empty");
      }
    }
  };

  const colorChangeClass = colorChange
    ? "bg-white text-blue-800"
    : isDarkPage
      ? "bg-transparent text-blue-800"
      : "bg-transparent text-black-800";

  const borderClass = isDarkPage
    ? colorChange
      ? " border-blue-800"
      : " "
    : " border-blue-800";

  return (
    <>
      <ErrorBox
        show={showErrorDialog}
        cancel={setShowErrorDialog}
        errorMessage={errorMessage}
      />
      <nav
        className={
          "flex justify-between py-3 fixed top-0 left-0 right-0 transition ease-in-out delay-100 px-28 " +
          colorChangeClass
        }
        style={
          // router.pathname === "/" ||
          // router.pathname === "/dao" ||
          // router.pathname.includes("/dao-home") ||
          // router.pathname === "/join" ||
          router.pathname == "/login"
            ?
            {zIndex: 10000} :
          {
            zIndex: 10000,
            background: "rgba(0, 0, 0, 0.5)",
            color: "#f1f1f1",
          }

          
        }
      >
        <h2 className="cursor-pointer flex items-center">
          <Link href="/" className="font-extrabold text-4xl -ml-20 lg:ml-5">
            Freelanco.
          </Link>
          <span className={"text-md ml-2 px-2 border rounded-2xl" + borderClass}>
            Beta
          </span>
          {isSearchPage && (
            <>
              <div className="flex justify-start items-center ml-5 mt-1 hideItOut">
                <input
                  type="text"
                  onChange={(e) => {
                    setNavSearch(e.target.value);
                  }}
                  onKeyDown={async (event) => {
                    if (event.key === "Enter") {
                      // Do something when the Enter key is pressed
                      setNavSearch(navSearch);
                      await searchGigs();
                    }
                  }}
                  value={navSearch}
                  className="placeholder:italic text-black placeholder:text-slate-500 w-[30vw] block rounded-l-lg bg-white h-10 border border-slate-300 py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-blue-800 focus:ring-sky-500 focus:ring-1 sm:text-sm hover:border-blue-800"
                  placeholder={
                    isSearchPage
                      ? "What service are you looking for today?"
                      : "Try 'building mobile app'"
                  }
                />
                <div className="h-10 w-10 bg-blue-800 rounded-r-lg flex justify-center items-center hover:bg-blue-800 cursor-pointer mr-2">
                  <img
                    style={{
                      filter: "brightness(0) invert(1)",
                    }}
                    className="h-5 w-5"
                    src="https://img.icons8.com/ios-glyphs/344/search--v1.png"
                    alt=""
                    onClick={searchGigs}
                  />
                </div>
              </div>
            </>
          )}
        </h2>

        <div className="flex justify-end gap-x-6 my-2 stormItOut">
          {!isSignInPage && (
            <>
              {isLoggedIn && (
                <>
                  {/* <span
                  className={
                    "font-light border-2 px-3 py-1 rounded-md text-sm cursor-pointer -mt-1 " +
                    borderClass
                  }
                >
                  <Link href="/login">Post a Job</Link>
                </span> */}
                  {router.pathname === "/freelancer" ||
                    router.pathname === "/seller" ||
                    router.pathname === "/seller-profile" ? (
                    <></>
                  ) : (
                    <>
                      <span
                        className={
                          "font-light border-2 px-3 py-1 rounded-md text-sm cursor-pointer -mt-1 " +
                          borderClass
                        }
                      >
                        <Link href="/conversation">Messages</Link>
                      </span>
                      <span
                        className={
                          "font-light border-2 px-3 py-1 rounded-md text-sm cursor-pointer -mt-1 " +
                          borderClass
                        }
                      >
                        {user?.freelancer_ref ? (
                          router.pathname.includes("gig") ||
                            router.pathname === "/" ? (
                            <Link href="/seller">Profile</Link>
                          ) : (
                            <Link href="seller">Switch to Seller</Link>
                          )
                        ) : (
                          <>
                            <a href="/freelancer">Become a Seller</a>
                          </>
                        )}
                      </span>
                      <span
                        className={
                          "font-light border-2 px-3 py-1 rounded-md text-sm cursor-pointer -mt-1 " +
                          borderClass
                        }
                      >
                        <Link href="/orders">Orders</Link>
                      </span>
                    </>
                  )}
                </>
              )}

              {router.pathname === "/dao-login" ? (
                <></>
              ) : (
                <>
                  {!isLoggedIn ? (
                    <>
                      <Link
                        href="/join"
                        className="font-light cursor-pointer text-sm mt-1"
                      >
                        Join
                      </Link>
                      <a
                        href="https://freelancodao.gitbook.io/freelancodao/"
                        className="font-light cursor-pointer text-sm mt-1"
                        target="_Blank"
                      >
                        White Paper
                      </a>
                      <Link
                        href="/faq"
                        className="font-light cursor-pointer text-sm mt-1"
                      >
                        FAQ
                      </Link>
                      <Link
                        href="/dao-login"
                        className="font-light cursor-pointer text-sm mt-1"
                      >
                        DAO
                      </Link>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}

              {!isLoggedIn ? (
                <>
                  <Link href="/explore">
                    <span
                      className={
                        "font-light cursor-pointer text-sm mt-1  " + borderClass
                      }
                    >
                      Explore
                    </span>
                  </Link>

                  <span
                    className={
                      "font-light border-2 px-3 py-1 rounded-md text-sm cursor-pointer -mt-1 " +
                      borderClass
                    }
                  >
                    <Link href="/login">Connect</Link>
                  </span>
                </>
              ) : (
                <>
                  {/* when logged in */}
                  {router.pathname === "/explore" ||
                    router.pathname === "/gigs" ? (
                    isSellerYet ? (
                      <a href="/seller">
                        <span className="font-light cursor-pointer text-sm mt-1">
                          Profile
                        </span>
                      </a>
                    ) : (
                      <></>
                    )
                  ) : (
                    <>
                      <Link href="/explore">
                        <span
                          className={
                            "font-light border-2 px-3 py-1.5 rounded-md text-sm cursor-pointer -mt-1 " +
                            borderClass
                          }
                        >
                          Explore
                        </span>
                      </Link>
                      <img
                        src={"notification.svg"}
                        onClick={() => {
                          getNotifications();
                          toggleNotifications();
                        }}
                        alt="notification"
                        height={"30px"}
                        width={"30px"}
                        className="cursor-pointer"
                      />
                      {showNotifications && (
                        <NotificationList
                          notifications={notifications}
                          toggleNotifications={toggleNotifications}
                          getNotifications={getNotifications}
                        />
                      )}
                      <span
                        onClick={() => signOut()}
                        href="/dao-login"
                        className={
                          "font-light border-2 px-3 py-1 rounded-md text-sm cursor-pointer -mt-1 " +
                          borderClass
                        }
                      >
                        Sign Out
                      </span>
                    </>
                  )}
                </>
              )}
            </>
          )}
          {/* <div onClick={() => connectAndSign()}> */}

          {/* </div> */}
          {isSignInPage ? <ConnectButton /> : <></>}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
