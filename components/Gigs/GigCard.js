import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default ({ isTopRated = true, gig, proposalsAll = [] }) => {
  const [isHover, setIsHover] = useState();
  const router = useRouter();
  // const [image, setImage] = useState(null);

  const colorChangeClass = isHover ? "text-blue-800" : "text-black";

  // const getData = () => {
  //   const getDataFromIPFS = async () => {
  //     try {
  //       console.log("URI:", "https://ipfs.io/" + gig.tokenUri);
  //       const json = await axios.get("https://ipfs.io/ipfs/" + gig.tokenUri);
  //       console.log("json: ", json);
  //       setImage("https://ipfs.io/ipfs/" + json.data.image.substring(7));
  //     } catch (e) {
  //       console.log("JSONL ", e);
  //     }
  //   };
  //   getDataFromIPFS();
  // };

  // useEffect(() => {
  //   if (gig.tokenUri) {
  //     console.log("GIGCARD: ", gig);
  //     getData();
  //   }
  // }, []);

  return (
    <div
      className="border border-white border-opacity-25 bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900 shadow-md rounded-lg backdrop-blur-lg overflow-hidden transition-all duration-500"
      // className="m-0 font-sans antialiased bg-gray-900 text-gray-100 select-none"
      style={{
        maxWidth: "250px",
      }}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onClick={() =>
        router.push({
          pathname: "/gig-detail",
          query: { gig: JSON.stringify(gig._id) },
        })
      }
    >
      {gig?.awsImageLink && (
        <div className="image-container">
          <Image
            className="rounded-2xl cursor-pointer gig-image -mb-24"
            src={gig?.awsImageLink}
            alt="product image"
            width={500}
            height={500}
            style={{
              height: 200,
              padding: "12px",
              borderRadius: "2rem",
            }}
          />
        </div>
      )}

      <div className="flex justify-start items-center">
        <Image
          className="rounded-3xl m-4 max-h-sm"
          // src={"https://ipfs.io/ipfs/" + gig?.freelancer?.ipfsImageHash}
          src={gig?.freelancer?.awsImageLink}
          alt="product image"
          width={20}
          height={20}
          style={{
            height: 20,
          }}
        />
        <div className="flex-col">
          <p className="font-bold text-gray-300 cursor-pointer">
            {gig?.freelancer?.name}
          </p>
          {gig?.freelancer?.isTopRated && (
            <p class="text-gray-300 text-xs font-medium">Top Rated Seller</p>
          )}
        </div>
      </div>
      <div className="px-5 pb-5">
        <h5
          class="my-5 text-white font-semibold hover:underline cursor-pointer"
          onClick={() => {
            router.push({
              pathname: "/gig-detail",
              query: { gig: JSON.stringify(gig._id) },
            });
          }}
        >
          {gig?.title}
        </h5>

        <div className="flex items-center mt-2.5 mb-5">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-yellow-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>First star</title>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {gig?.rating.toFixed(2)}
          </span>

          <span className="text-gray-500 text-xs ml-1">
            ({gig?.rating.toFixed(0)})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            <div className="bg-blue-300 border-2 rounded-full flex items-center space-x-1 px-2 cursor-pointer h-6 justify-center hover:bg-gray-200">
              <img
                src="https://img.icons8.com/material-outlined/344/facebook-like--v1.png"
                alt=""
                className="h-4 w-4 w" //https://img.icons8.com/material-rounded/344/dislike.png
              />
            </div>
            <div className="bg-blue-300 border-2 rounded-full flex items-center space-x-2 px-2 cursor-pointer h-6 justify-center hover:bg-gray-200">
              <img
                src="https://img.icons8.com/material-rounded/344/dislike.png"
                alt=""
                className="h-4 w-4" //https://img.icons8.com/material-rounded/344/dislike.png
              />
            </div>
          </div>
          <span className="text-xl font-bold text-white ">
            ${gig?.plans?.length > 0 ? gig?.plans[0]?.price : <></>}
          </span>
        </div>
      </div>
    </div>
  );
};
