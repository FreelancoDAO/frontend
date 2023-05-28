import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

const TxBox = ({ cancel, show, txMessage, routeToPush }) => {
  // On componentDidMount set the timer

  const [counter, setCounter] = useState(0);
  const router = useRouter();

  useInterval(() => {
    if (counter < 2000) {
      setCounter(counter + 2.52);
    }
  }, 500);

  // useEffect(() => {
  //   const timeId = setTimeout(() => {
  //     // After 3 seconds set the show value to false
  //     cancel(false);
  //     if (routeToPush) router.push(routeToPush);
  //   }, 50000);

  //   return () => {
  //     clearTimeout(timeId);
  //   };
  // }, []);

  return (
    <div
      id="popup-modal"
      tabindex="-1"
      class={show === true ? "absoluteCenter transition-all" : "hidden"}
      style={{
        marginTop: 100,
      }}
    >
      <div class="relative bg-gray-900 rounded-lg shadow">
        <button
          type="button"
          onClick={() => cancel(false)}
          class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          data-modal-hide="popup-modal"
        >
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-6 text-center">
          <svg
            aria-hidden="true"
            class="mx-auto mb-4 text-gray-400 w-14 h-14"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 class="mb-5 text-lg font-bold text-gray-500">
            Waiting for Confirmation
          </h3>
          <div class="w-full bg-gray-200 rounded-full"></div>
          <h3 class="mb-5 mt-2 text-lg font-normal text-gray-500">
            Transaction Hash: <br />
          </h3>
          <h3 class="mb-5 font-normal text-white text-xs">
            {txMessage}

            {/* {proposalsData[selec'tedOrder]?.price} from{" "}
            {proposalsData[selectedOrder]?.user?.wallet_address}? */}
          </h3>

          <button
            data-modal-hide="popup-modal"
            type="button"
            onClick={() => cancel(false)}
            class="text-blue-500 bg-black hover:bg-white-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-black text-sm font-medium px-5 py-2.5 hover:text-white focus:z-10"
          >
            Hide
          </button>
        </div>
      </div>
    </div>
  );
};

export default TxBox;
