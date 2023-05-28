import { useRouter } from "next/router";
import React from "react";

const classes = {
  messageRow: {
    display: "flex",
  },
  messageRowRight: {
    display: "flex",
    justifyContent: "flex-end",
  },
  messageBlue: {
    backgroundColor: "#A8DDFD",
    // maxWidth: "60%",
    // minWidth:"10%",
    //height: "50px",
    position: "relative",
    marginLeft: "20px",
    marginBottom: "0.4px",
    padding: "10px",
    textAlign: "left",
    font: "400 .9em 'Open Sans', sans-serif",
    border: "1px solid #97C6E3",
    borderRadius: "10px",
    "&:after": {
      content: "''",
      position: "absolute",
      width: "0",
      height: "0",
      borderTop: "15px solid #A8DDFD",
      borderLeft: "15px solid transparent",
      borderRight: "15px solid transparent",
      top: "0",
      left: "-15px",
    },
    "&:before": {
      content: "''",
      position: "absolute",
      width: "0",
      height: "0",
      borderTop: "17px solid #97C6E3",
      borderLeft: "16px solid transparent",
      borderRight: "16px solid transparent",
      top: "-1px",
      left: "-17px",
    },
  },
  messageOrange: {
    position: "relative",
    marginRight: "20px",
    marginBottom: "0.4px",
    padding: "10px",
    backgroundColor: "#03265b",
    maxWidth: "60%",
    minWidth: "10%",
    color: "white",
    //height: "50px",
    textAlign: "left",
    font: "400 .9em 'Open Sans', sans-serif",
    // border: "1px solid #dfd087",
    borderRadius: "10px",
    "&:after": {
      content: "''",
      position: "absolute",
      width: "0",
      height: "0",
      borderTop: "15px solid #f8e896",
      borderLeft: "15px solid transparent",
      borderRight: "15px solid transparent",
      top: "0",
      right: "-15px",
    },
    "&:before": {
      content: "''",
      position: "absolute",
      width: "0",
      height: "0",
      borderTop: "17px solid #dfd087",
      borderLeft: "16px solid transparent",
      borderRight: "16px solid transparent",
      top: "-1px",
      right: "-17px",
    },
  },

  messageContent: {
    padding: 0,
    margin: 0,
    wordWrap: "break-word",
  },
  messageContentOffer: {
    margin: "auto",
    backgroundColor: "black",
    color: "white",
    padding: "10px",
    width: "80%",
    padding: "2rem",
    fontSize: "1.4rem",
    borderRadius: "10px",
    wordWrap: "break-word",
  },
  messageTimeStampRight: {
    // position: "absolute",
    fontSize: ".85em",
    fontWeight: "550",
    marginBottom: "5px",
    // padding:"5px"
  },

  orange: {
    color: "#ff5722",
    backgroundColor: "#ff5722",
    width: 40,
    height: 40,
    marginTop: 9,
  },
  avatarNothing: {
    color: "transparent",
    backgroundColor: "transparent",
    width: "40px",
    height: "40px",
  },
  displayName: {
    marginBottom: "5px",
    fontWeight: "550",
  },
};

function isImageOrDocument(fileUrl) {
  const extension = fileUrl.split(".").pop().toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "image";
    case "pdf":
    case "doc":
    case "docx":
    case "xls":
    case "xlsx":
    case "ppt":
    case "pptx":
    case "txt":
    case "csv":
      return "document";
    default:
      return "unknown";
  }
}

//avatarが左にあるメッセージ（他人）
export const MessageLeft = (props) => {
  const router = useRouter();
  const ext = isImageOrDocument(props.message);
  console.log(props.message, ext);
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp
    ? new Date(props.timestamp).getHours().toString().padStart(2, "0") +
    ":" +
    new Date(props.timestamp).getMinutes().toString().padStart(2, "0")
    : "";
  const photoURL = props.photoURL ? props.photoURL : "/wolf.jpg";
  const displayName = props.displayName;
  return (
    <>
      <div
        style={
          props.timestamp != null
            ? { marginTop: "5px", ...classes.messageRow }
            : { ...classes.messageRow }
        }
      >
        {props.timestamp != null ? (
          <img
            className="rounded-full"
            alt={displayName}
            style={classes.orange}
            src={photoURL}
            height={"100px"}
            width={"100px"}
          />
        ) : (
          <span style={{ width: "32px" }}></span>
        )}
        <div style={{ minWidth: "10%", maxWidth: "60%" }}>
          <div
            style={
              props.type == "Offer"
                ? {
                  position: "relative",
                  marginLeft: "20px",
                  marginBottom: "0.4px",
                  padding: "10px",
                  textAlign: "left",
                  color: "white",
                  font: "400 .9em 'Open Sans', sans-serif",
                  border: "1px solid #97C6E3",
                  borderRadius: "10px",
                  "&:after": {
                    content: "''",
                    position: "absolute",
                    width: "0",
                    height: "0",
                    borderTop: "15px solid #A8DDFD",
                    borderLeft: "15px solid transparent",
                    borderRight: "15px solid transparent",
                    top: "0",
                    left: "-15px",
                  },
                }
                : classes.messageBlue
            }
          >
            {props.timestamp != null ? (
              <div style={classes.displayName}>
                <span style={{ paddingRight: "5px" }}>{displayName}</span>
                <span style={classes.messageTimeStampRight}>{timestamp}</span>
              </div>
            ) : null}
            <div>
              {ext === "document" ? (
                <p style={classes.messageContent}>
                  <a href={message} target="_blank">
                    <u>{message}</u>
                  </a>
                </p>
              ) : ext === "image" ? (
                <img
                  src={message}
                  style={{ height: "300px", width: "auto" }}
                  alt=""
                />
              ) : props.type == "Offer" ? (
                <>
                  <div class="w-full p-4 text-center bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <h5
                      class={
                        message.includes("Over")
                          ? "mb-2 text-3xl font-bold text-red-600"
                          : "mb-2 text-3xl font-bold text-white dark:text-white"
                      }
                    >
                      {message.includes("Over")
                        ? "Order Disputed"
                        : "Congratulations"}
                    </h5>
                    <p
                      class="mb-5 capitalize text-gray-500 sm:text-lg dark:text-gray-400"
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      {message.includes("Over")
                        ? "We regret to inform you that the order you have placed with us has encountered a dispute. Our DAO members is currently investigating the matter and will keep you informed of any developments. "
                        : message}
                      {message.includes("Over") && (
                        <p>
                          Please refer to the dispute page to connect with the
                          DAO.
                        </p>
                      )}
                    </p>
                    <div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                      <div
                        href="#"
                        class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                      >
                        <svg
                          class="mr-3 w-7 h-7"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fab"
                          data-icon="apple"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                        >
                          <path
                            fill="currentColor"
                            d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                          ></path>
                        </svg>
                        <div class="text-left cursor-pointer">
                          {message.includes("Over") ? (
                            <div class="mb-1 text-xs">Connect</div>
                          ) : (
                            <div
                              class="mb-1 text-xs"
                              onClick={() => router.push("/orders")}
                            >
                              See Order
                            </div>
                          )}

                          <div class="-mt-1 font-sans text-sm font-semibold">
                            FreelancoDAO
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p style={classes.messageContent}>{message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
//avatarが右にあるメッセージ（自分）
export const MessageRight = (props) => {
  const { daoFrom } = props;
  const ext = isImageOrDocument(props.message);
  // console.log(props.message, ext);
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp
    ? new Date(props.timestamp).getHours().toString().padStart(2, "0") +
    ":" +
    new Date(props.timestamp).getMinutes().toString().padStart(2, "0")
    : "";
  return (
    <div
      style={
        props.timestamp != null
          ? { marginTop: "10px", ...classes.messageRowRight }
          : { ...classes.messageRowRight }
      }
    >
      <div style={classes.messageOrange}>
        {props.timestamp != null ? (
          daoFrom == null ? (
            <div style={classes.messageTimeStampRight}>{timestamp}</div>
          ) : (
            <div className="flex w-full justify-between">
              <div className="">{daoFrom}</div>
              <div style={classes.messageTimeStampRight}>{timestamp}</div>
            </div>
          )
        ) : // <div style={classes.messageTimeStampRight}>{timestamp}</div>
          null}
        {ext === "document" ? (
          <p style={classes.messageContent}>
            <a href={message} target="_blank">
              <u>{message}</u>
            </a>
          </p>
        ) : ext === "image" ? (
          <img
            src={message}
            style={{ height: "auto", width: "300px" }}
            alt=""
          />
        ) : props.type == "Offer" ? (
          <>
            <div class="w-full p-4 text-center bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
              <h5
                class={
                  message.includes("Over")
                    ? "mb-2 text-3xl font-bold text-red-600"
                    : "mb-2 text-3xl font-bold text-white dark:text-white"
                }
              >
                {message.includes("Over")
                  ? "Order Disputed"
                  : "Congratulations"}
              </h5>
              <p
                class="mb-5 capitalize text-gray-500 sm:text-lg dark:text-gray-400"
                style={{
                  fontSize: "12px",
                }}
              >
                {message.includes("Over")
                  ? "We regret to inform you that the order you have placed with us has encountered a dispute. Our DAO members is currently investigating the matter and will keep you informed of any developments. "
                  : message}
                {message.includes("Over") && (
                  <p>
                    Please refer to the dispute page to connect with the DAO.
                  </p>
                )}
              </p>
              <div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                <div
                  href="#"
                  class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                >
                  <svg
                    class="mr-3 w-7 h-7"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="apple"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="currentColor"
                      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                    ></path>
                  </svg>
                  <div class="text-left cursor-pointer">
                    {message.includes("Over") ? (
                      <div class="mb-1 text-xs">Connect</div>
                    ) : (
                      <div
                        class="mb-1 text-xs"
                        onClick={() => router.push("/orders")}
                      >
                        See Order
                      </div>
                    )}

                    <div class="-mt-1 font-sans text-sm font-semibold">
                      FreelancoDAO
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p style={classes.messageContent}>{message}</p>
        )}
      </div>
    </div>
  );
};
