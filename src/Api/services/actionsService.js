import API from "../index";

export const actionsService = {
  sendPDF: (ventaId, datosCompra, totalPuntos) =>
    API.post("enviar-pdf/", {
      venta_id: ventaId,
      datos_compra: datosCompra,
      total_puntos: totalPuntos,
    }),
  deleteItem: (param, id) => API.delete(`/${param}/${id}/`),

  downloadPDF: async (ventaId) => {
    return API.get(`/ventas/${ventaId}/descargar-comprobante/`, {
      responseType: "blob",
    });
  },
};
