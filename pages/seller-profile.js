import React, { useState } from "react";
import SellerDetails from "../components/Freelancer/SellerDetails";
import FreelancerProfile from "../components/Freelancer/FreelancerProfile";
import { useRouter } from "next/router";

const FreelancerDetails = ({ freelancer }) => {
  const [freelancerUser, setFreelancerUser] = useState(null);
  const allowEdit = true;

  return (
    <div
      className="flex px-20 space-x-8 pt-20 text-white blur-bg bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 min-h-screen"
      style={{
        // backgroundImage: `url('/ff.jpeg')`,
        "backdrop-filter": "blur(10px)",
      }}
    >
      <div className="flex-3/4 w-1/4">
        <FreelancerProfile
          allowEdit={allowEdit}
          freelancerUser={freelancerUser}
          setFreelancerUser={setFreelancerUser}
        />
      </div>
      <div className="flex-1/4 w-3/4">
        <SellerDetails
          allowEdit={allowEdit}
          freelancerUser={freelancerUser}
          setFreelancerUser={setFreelancerUser}
        />
      </div>
    </div>
  );
};

export default FreelancerDetails;
