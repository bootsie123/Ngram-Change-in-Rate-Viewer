import api from "@/lib/axios";

export default {
  getData(query, startYear = 1500, endYear = 2019, corpus = 26, smoothing = 0) {
    return api.get("/ngram", {
      params: {
        query,
        startYear,
        endYear,
        corpus,
        smoothing
      }
    });
  },
  async getCorpuses() {
    return api.get("/corpuses");
  }
};
