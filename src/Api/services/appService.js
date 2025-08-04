import API from "../index";

export const appService = {
  getHomeData: () => API.get("home-data/"),
  getFuentesAplicar: () => API.get("fuentes-aplicar/"),
};