import React, { useEffect, useState } from "react";
import ProposalsListing from "../../components/DAO/ProposalsListing";
import { getDaoTreasury, getProposolsOfDao, tallyProposals } from "../../api/proposal";
import useAuth from "../../hooks/useAuth";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const DaoHome = () => {
  const [daoProposals, setDAOProposals] = useState([]);
  const [totalVoters, setTotalVoters] = useState(undefined);
  const [teasuryBalance, setTreasuryBalance] = useState(undefined);
  const [tallyProposal, setTallyProposal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { user, daoNFTContract } = useAuth();
  console.log("daoProposals", daoProposals);
  function matchAndAddTallyId(daoProposals, tallyProposals) {
    daoProposals.forEach(daoProposal => {
      tallyProposals.forEach(tallyProposal => {
        if (daoProposal.reason == tallyProposal.description) {
          daoProposal.tallyId = tallyProposal.id;
        }
      });
    });

    return daoProposals;
  }



  const matchAndAddTallyIdToProposals = () => {
    if (daoProposals.length > 0 && tallyProposal.length > 0) {
      const updatedProposals = matchAndAddTallyId(daoProposals, tallyProposal);
      setIsLoading(false);
      setDAOProposals(updatedProposals);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const re = await getDaoTreasury();
      if (re?.balance) {
        setTreasuryBalance(re.balance);
      }

      const res = await getProposolsOfDao();
      let myProposals = [];

      let total0Votes = 0;
      let total1Votes = 0;

      const voterAddresses = new Set();

      for (let i = 0; i < res.length; i++) {
        const proposal = res[i];
        for (let j = 0; j < proposal.votes.length; j++) {
          voterAddresses.add(proposal.votes[j].wallet_address);
          const vote = proposal.votes[j];
          if (vote.voteSupport === 0) {
            total0Votes++;
          } else if (vote.voteSupport === 1) {
            total1Votes++;
          }
        }

        myProposals.push({ ...proposal, total0Votes, total1Votes });
      }
      console.log(myProposals);
      console.log(voterAddresses);
      setTotalVoters(Array.from(voterAddresses).length);

      setDAOProposals(myProposals);
    };

    const getTallyProposal = async () => {
      const res = await tallyProposals();
      setTallyProposal(res?.data?.proposals)
    }

    getData();
    getTallyProposal();
  }, []);


  useEffect(() => {
    matchAndAddTallyIdToProposals();
  }, [daoProposals, tallyProposal]);

  const handleButtonClick = () => {
    window.open(`https://www.tally.xyz/gov/freelancodao-beta/proposals`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 min-h-screen">
      <div className="flex flex-col items-start justify-center text-center w-full text-white font-extrabold px-40 py-20">
        <p className="text-5xl ">Governance Overview</p>
        <div className="flex gap-x-2">
          <div className="w-64 border-2 border-white h-16 mt-5 rounded-2xl">
            <div className="flex-col text-md pt-1">
              <p>{daoProposals?.length}</p>
              <p className="text-white-500">Proposals Created</p>
            </div>
          </div>
          <div className="w-64 border-2 border-white h-16 mt-5 rounded-2xl">
            <div className="flex-col text-md pt-1">
              <p>{totalVoters}</p>
              <p className="text-white-500">Voting Addresses</p>
            </div>
          </div>
          <div className="w-64 border-2 border-white h-16 mt-5 rounded-2xl">
            <div className="flex-col text-md pt-1">
              <p>{teasuryBalance} MATIC</p>
              <p className="text-white-500">Treasury</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end mx-6 space-x-4">
        <button class="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={handleButtonClick}>
          view all proposals on tally
        </button>
      </div>
      {isLoading ? (
        <div className="flex w-3/4 justify-center mt-5 mx-5">
          <img
            src="loading.gif"
            height={80}
            width={80}
          />
        </div>
      ) :
        <ProposalsListing daoProposals={daoProposals} />}
    </div>
  );
};

export default DaoHome;
