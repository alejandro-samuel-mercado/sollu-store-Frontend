import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserQRCodeReader } from "@zxing/library";
import { actionsService } from "../../Api/services/actionsService";
import { useDatosPublic } from "../../context/DatosPublicContext";
import { useAuth } from "../Auth/useAuth";
import jsPDF from "jspdf";
import "jspdf-autotable";
import API from "../../Api";

export const Actions = () => {
  const { recargarDatos } = useDatosPublic();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMuted, setIsMuted] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [codeReader] = useState(new BrowserQRCodeReader());
  const [videoStream, setVideoStream] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleLink = useCallback((url) => {
    window.open(url, "_blank");
  }, []);

  const toggleQRScanner = useCallback(() => {
    setShowQRScanner((prev) => !prev);
  }, []);

  const startQRScan = useCallback(
    (videoElementId) => {
      codeReader
        .decodeFromVideoDevice(null, videoElementId, (result, error) => {
          if (result) {
            const qrContent = result.getText();
            if (qrContent.startsWith("PRODUCTO_ID:")) {
              const productId = qrContent.split("PRODUCTO_ID:")[1];
              stopQRScan();
              navigate(`/productos/${productId}`);
            }
          }
          if (error && error.name !== "NotFoundException") {
            console.error("Error al escanear QR:", error);
          }
        })
        .then((stream) => {
          setVideoStream(stream);
        })
        .catch((err) => console.error("Error iniciando escáner:", err));
    },
    [codeReader, navigate]
  );

  const stopQRScan = useCallback(() => {
    if (codeReader) {
      codeReader.reset();
    }
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    setShowQRScanner(false);
  }, [codeReader, videoStream]);

  const generarPDF = useCallback(
    async (datosCompra, totalPuntos, ventaId) => {
      setPdfLoading(true);
      setPdfError(null);

      console.log("datosCompra recibido en generarPDF:", datosCompra);

      try {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 8;
        let yPosition = margin;

        // Encabezado: Información de la Empresa
        doc.setFillColor(220, 220, 220);
        doc.rect(0, 0, pageWidth, 30, "F");
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Factura Fiscal", margin, yPosition + 10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text(
          datosCompra?.datosEmpresa?.nombre?.contenido || "Empresa",
          pageWidth - 70,
          yPosition
        );
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(
          `Dirección: ${
            datosCompra?.datosEmpresa?.direccion?.contenido || "N/A"
          }, ${datosCompra?.datosEmpresa?.ciudad?.contenido || "N/A"}, ${
            datosCompra?.datosEmpresa?.pais?.contenido || "N/A"
          }`,
          pageWidth - 120,
          yPosition + 15
        );
        doc.text(
          `Tel: ${
            datosCompra?.datosEmpresa?.telefono?.contenido || "N/A"
          } | Email: ${datosCompra?.datosEmpresa?.email?.contenido || "N/A"}`,
          pageWidth - 120,
          yPosition + 20
        );
        yPosition += 35;

        // Datos del Documento
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(
          `Factura N°: ${ventaId.toString().padStart(8, "0")}`,
          margin,
          yPosition
        );
        doc.text(
          `Fecha de Emisión: ${new Date().toLocaleDateString("es-ES")}`,
          pageWidth - margin - 60,
          yPosition
        );
        yPosition += 10;

        // Datos del Cliente
        doc.setFont("helvetica", "bold");
        doc.text("Cliente:", margin, yPosition);
        yPosition += 5;
        doc.setFont("helvetica", "normal");
        doc.text(
          `Nombre: ${datosCompra?.nombre || "Desconocido"}`,
          margin,
          yPosition
        );
        doc.text(
          `Teléfono: ${datosCompra?.telefono || "No disponible"}`,
          margin,
          yPosition + 5
        );
        doc.text(
          `Correo: ${datosCompra?.correo || "No disponible"}`,
          margin,
          yPosition + 10
        );
        doc.text(
          `Dirección: ${datosCompra?.domicilio || "No disponible"}`,
          margin,
          yPosition + 15
        );
        doc.text(
          `Ciudad: ${datosCompra?.cityComprador || "N/A"}`,
          margin,
          yPosition + 20
        );
        doc.text(
          `País/Estado: ${datosCompra?.paisComprador || "N/A"}`,
          margin,
          yPosition + 25
        );
        doc.text(
          `ID Fiscal: ${user?.id || "No proporcionado"}`,
          margin,
          yPosition + 30
        );
        yPosition += 35;

        // Detalles de Entrega
        doc.setFont("helvetica", "bold");
        doc.text("Detalles de Entrega:", margin, yPosition);
        yPosition += 5;
        doc.setFont("helvetica", "normal");
        doc.text(
          `Método: ${datosCompra?.finalEnvio || "No disponible"}`,
          margin,
          yPosition
        );
        doc.text(
          `Fecha: ${
            datosCompra?.fecha_entrega?.split("T")[0] || "No disponible"
          }`,
          margin,
          yPosition + 5
        );
        doc.text(
          `Horario: ${datosCompra?.horario_entrega || "No disponible"}`,
          margin,
          yPosition + 10
        );
        yPosition += 20;

        // Línea divisoria
        doc.setDrawColor(0, 0, 0);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Tabla de Productos
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Detalles de la Compra", margin, yPosition);
        yPosition += 5;

        const productos =
          datosCompra?.productos?.map((item, index) => [
            index + 1,
            `${item?.nombre || "Desconocido"} (Talle: ${item?.talle || "N/A"})`,
            `$${parseFloat(item?.precio_unitario || 0).toFixed(2)}`,
            item?.cantidad || 1,
            `$${(item?.precio_unitario * item?.cantidad || 0).toFixed(2)}`,
          ]) || [];

        doc.autoTable({
          startY: yPosition,
          head: [
            ["#", "Descripción", "Precio Unitario", "Cantidad", "Subtotal"],
          ],
          body: productos,
          theme: "grid",
          styles: { fontSize: 10, cellPadding: 3, overflow: "linebreak" },
          headStyles: {
            fillColor: [50, 50, 50],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 90 },
            2: { cellWidth: 30 },
            3: { cellWidth: 20 },
            4: { cellWidth: 30 },
          },
        });

        // Totales e Impuestos
        yPosition = doc.lastAutoTable.finalY + 10;
        const tasaImpuesto = datosCompra?.impuesto / 100;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(
          `Subtotal: $${
            datosCompra?.precioFinalSinImpuesto?.toFixed(2) || "0.00"
          }`,
          pageWidth - margin - 60,
          yPosition
        );
        doc.text(
          `Envío: $${datosCompra?.precioEnvio?.toFixed(2) || "0.00"}`,
          pageWidth - margin - 60,
          yPosition + 10
        );
        doc.text(
          `Impuesto (${(tasaImpuesto * 100).toFixed(1)}%): $${
            (datosCompra?.precioFinalSinImpuesto * tasaImpuesto)?.toFixed(2) ||
            "0.00"
          }`,
          pageWidth - margin - 60,
          yPosition + 20
        );
        doc.setFont("helvetica", "bold");
        doc.text(
          `Total: $${datosCompra?.precioFinal?.toFixed(2) || "0.00"}`,
          pageWidth - margin - 60,
          yPosition + 30
        );
        doc.text(
          `Moneda: ${datosCompra?.monedaComprador || "USD"}`,
          pageWidth - margin - 60,
          yPosition + 40
        );
        yPosition += 50;

        // Puntos Acumulados
        doc.setFont("helvetica", "normal");
        doc.text(`Puntos acumulados: ${totalPuntos || 0}`, margin, yPosition);
        yPosition += 10;

        // Pie de Página: Información Legal
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        const legalText = [
          "Este documento es un comprobante fiscal válido. Conservar para fines fiscales.",
          `Emitido conforme a las leyes fiscales aplicables en ${
            datosCompra?.datosEmpresa?.pais?.contenido || "N/A"
          }.`,
          "Para reclamos, contactar a info@empresa.com dentro de los 30 días posteriores a la emisión.",
        ];
        legalText.forEach((line, index) => {
          doc.text(line, margin, pageHeight - margin - 15 + index * 5, {
            align: "left",
          });
        });

        // Guardar el PDF localmente
        const pdfName = `Factura_${ventaId.toString().padStart(8, "0")}.pdf`;
        doc.save(pdfName);

        // Enviar al backend usando el mismo adjustedDatosCompra
        console.log("Enviando al backend:", datosCompra);
        const response = await API.post("enviar-pdf/", {
          venta_id: ventaId,
          datos_compra: datosCompra, // Usamos el mismo datosCompra que para el PDF
          total_puntos: totalPuntos,
        });

        if (response.status === 200) {
          const { pdf_url } = response.data;
          console.log("PDF enviado al backend con éxito:", pdf_url);
          return pdf_url;
        } else {
          throw new Error("Error al enviar el PDF al backend");
        }
      } catch (err) {
        console.error("Error al enviar PDF al backend:", err);
        setPdfError(err.message || "Error al enviar el PDF");
      } finally {
        setPdfLoading(false);
      }
    },
    [user]
  );

  const descargarComprobante = useCallback(async (ventaId) => {
    try {
      const response = await actionsService.downloadPDF(ventaId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Factura_${ventaId.toString().padStart(8, "0")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error al descargar comprobante:", error);
      setPdfError("Error al descargar el comprobante");
    }
  }, []);

  const deleteItem = useCallback(async (param, id) => {
    try {
      await actionsService.deleteItem(param, id);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  }, []);

  const handleFavoritoClick = async (producto, setEsFavorito) => {
    try {
      const response = await API.post("perfilesUsuarios/toggle-favorito/", {
        producto_id: producto.id,
      });
      setEsFavorito(response.data.message.includes("agregado"));
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  const updateReview = async (reviewId, updatedData) => {
    try {
      const response = await API.patch(`reviews/${reviewId}/`, updatedData);
      recargarDatos();
      return true;
    } catch (err) {
      if (err.response?.status === 403) {
        console.error("No tienes permiso para editar esta reseña");
      } else {
        console.error("Error al actualizar la reseña");
      }
      console.error(err);
      return false;
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await API.delete(`reviews/${reviewId}/`);
      recargarDatos();
      return true;
    } catch (err) {
      if (err.response?.status === 403) {
        console.error("No tienes permiso para editar esta reseña");
      } else {
        console.error("Error al actualizar la reseña");
      }
      console.error(err);
      return false;
    }
  };

  return {
    isMuted,
    toggleMute,
    toggleLink,
    toggleQRScanner,
    showQRScanner,
    startQRScan,
    stopQRScan,
    generarPDF,
    descargarComprobante,
    deleteItem,
    handleFavoritoClick,
    pdfLoading,
    pdfError,
    updateReview,
    deleteReview,
  };
};
