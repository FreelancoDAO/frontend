import axios from "axios";
import axiosInstance from "../axios";

export const addProposal = (formData) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`/proposal`, formData)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

export const getProposalByGigRef = (formData) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`/proposal/getProposalByStatus`, formData)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

export const getOrders = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`/proposal/getOrders`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

export const updateProposal = (proposalId, status) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .put(`/proposal/${proposalId}/${status}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

export const getProposolsOfDao = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`/proposal/getProposolsOfDao`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};
export const getDaoTreasury = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`/proposal/getDaoTreasury`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

export const tallyProposals = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(`https://api.tally.xyz/query`, {
        "query": "\n    query GovernanceProposals($sort: ProposalSort, $chainId: ChainID!, $pagination: Pagination, $governanceIds: [AccountID!], $proposerIds: [AccountID!], $voters: [Address!], $votersPagination: Pagination, $includeVotes: Boolean!) {\n  proposals(\n    sort: $sort\n    chainId: $chainId\n    pagination: $pagination\n    governanceIds: $governanceIds\n    proposerIds: $proposerIds\n  ) {\n    id\n    description\n    statusChanges {\n      type\n    }\n    block {\n      timestamp\n    }\n    voteStats {\n      votes\n      weight\n      support\n      percent\n    }\n    votes(voters: $voters, pagination: $votersPagination) @include(if: $includeVotes) {\n      support\n    }\n    governance {\n      id\n      quorum\n      name\n      timelockId\n      organization {\n        visual {\n          icon\n        }\n      }\n      tokens {\n        decimals\n      }\n    }\n    tallyProposal {\n      id\n      createdAt\n      status\n    }\n  }\n}\n    ",
        "variables": {
          "chainId": "eip155:80001",
          "governanceIds": ["eip155:80001:0xc35E1144242cfA6DfB74B6f1090ba15f938BE85c"],
          "includeVotes": false,
          // "pagination": { "limit": 10, "offset": 0 },
          "sort": { "field": "START_BLOCK", "order": "DESC" },
          "votersPagination": { "limit": 1, "offset": 0 }

        }
      }, {
        headers: {
          "Api-Key": "a0a4cd00bb6953720c9c201c010cdd36a563e65c97e926a36a8acdfcd1d1eeb7"
        }
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};
