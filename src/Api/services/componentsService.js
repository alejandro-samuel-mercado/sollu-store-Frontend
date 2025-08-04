import API from "../index";

export const componentsService = {
  getComponents: () => API.get("componentes/1/"),
  getPuntosClub: () => API.get("puntos-club/1/"),
};