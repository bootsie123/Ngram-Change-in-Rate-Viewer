import axios from "axios";

const API_URL = "/";

const options = { baseURL: API_URL };

const http = axios.create(options);

const production = process.env.VUE_APP_NODE_ENV === "production";

http.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    if (err.response) {
      return Promise.reject(err.response);
    } else if (err.request && !production) {
      console.error(err.request);
    } else {
      console.error("Error", err);
    }

    if (!production) {
      console.error(err.config);
    }

    return Promise.reject(err);
  }
);

export default http;
