import axiosInstance from "../axios";

export const requestMessage = (userData) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .post(`/auth/request-message`, userData)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });

export const verifySignature = (verification_data) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .post(`/auth/verify`, verification_data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => alert(err?.response?.data?.err));
  });

export const emailVerify = (email) => {
  new Promise((resolve, reject) => {
    axiosInstance
      .post(`/auth/verify-email`, { email })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

export const userLogin = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get("/auth/login")
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

export const getProfile = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get("/profile")
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

export const getProposalsOfClient = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get("/proposal/getProposalsOfClient")
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

export const socialLogin = (data) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .post(`/auth/socialLogin`, data)
      .then((res) => {
        console.log("res----------------------------->", res);
        resolve(res.data);
      })
      .catch((err) => alert(err?.response?.data?.err));
  });
