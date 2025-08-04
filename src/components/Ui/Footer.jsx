import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { useAppDataContext } from "../../features/AppData/AppDataContext";
import { useDatosPublic } from "../../context/DatosPublicContext";

const Item = ({ text }) => {
  return (
    <>
      <li className="mb-3">
        <span className="fa-li">
          <i className="fas fa-home"></i>
        </span>
        <span className="ms-2">{text}</span>
      </li>
    </>
  );
};

export const Footer = () => {
  const { informacionWeb } = useDatosPublic()

  const lema = informacionWeb?.find((info) => info.nombre.toLowerCase() === "lema")
  const horarioMañana = informacionWeb?.find((info) => info.nombre.toLowerCase() === "horarios_mañana")
  const horarioTarde = informacionWeb?.find((info) => info.nombre.toLowerCase() === "horarios_tarde")
  const email = informacionWeb?.find((info) => info.nombre.toLowerCase() === "correo_sitio")
  const telefono = informacionWeb?.find((info) => info.nombre.toLowerCase() === "telefono")
  const pais = informacionWeb?.find((info) => info.nombre.toLowerCase() === "pais")
  const ciudad = informacionWeb?.find((info) => info.nombre.toLowerCase() === "ciudad")


  return (
    <>
      <footer className="text-white text-center footer-container bg-footer">
        <div className="container p-4 ">
          <div className="row mt-4">
            <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
              <h5 className="text-uppercase mb-4">Sobre Nosotros</h5>
              <p>
                {lema?.contenido || ""}
              </p>
            </div>

            <div className="grid-column col-lg-4 col-md-6 mb-4 mb-md-0">
              <ul className="fa-ul">
                <Item text={`${ciudad?.contenido}, ${pais?.contenido}`} />
                <Item text={`Email: ${email?.contenido}`} />
                <Item text={`Télefono: ${telefono?.contenido}`} />
              </ul>
            </div>

            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <h5 className="text-uppercase mb-4">Horario de atención</h5>

              <table name="table text-center text-white">
                <tbody className="fw-normal">
                  <tr>
                    <td>Lunes - Viernes:</td>
                    <td>{horarioMañana?.contenido}</td><br />
                    <td>{horarioTarde?.contenido}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="text-center p-3">© 2024 Copyright Mercado Alejandro Samuel:</div>
      </footer>
    </>
  );
};
