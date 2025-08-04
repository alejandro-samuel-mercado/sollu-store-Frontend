import React, { useState, useEffect, useContext } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDatosPublic } from "../../context/DatosPublicContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import API from "../../Api/index.js";
import { useAuthContext } from "../../features/Auth/AuthContext";
import { useAppDataContext } from "../../features/AppData/AppDataContext";

registerLocale("es", es);
const axiosInstance = axios.create({
  withCredentials: false,
});

export const FormularioCompra = ({ productosCarrito, precio }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { envio, barrios, miPerfil, estadosDeVenta, informacionWeb } =
    useDatosPublic();

  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    nombre: miPerfil?.nombre_apellido || "",
    telefono: miPerfil?.telefono || "",
    correo: user?.email || "",
    finalEnvio: "",
    barrio: miPerfil?.barrio || "",
    domicilio: miPerfil?.domicilio || "",
    fechaSeleccionada: null,
    horaSeleccionada: "",
    cupon: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [datosEmpresa, setDatosEmpresa] = useState({});
  const [step, setStep] = useState("step1");
  const [precioFinal, setPrecioFinal] = useState(precio);
  const [precioFinalSinImpuesto, setPrecioFinalSinImpuesto] = useState(precio);
  const [precioEnvio, setPrecioEnvio] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [impuesto, setImpuesto] = useState(0);
  const [estadoFinalVenta, setEstadoFinalVenta] = useState("");
  const [mensajeCupon, setMensajeCupon] = useState("");
  const [mensajeEnvio, setMensajeEnvio] = useState("");
  const [mensajeForm, setMensajeForm] = useState("");
  const [cuponEncontrado, setCuponEncontrado] = useState(false);

  const direccion = informacionWeb?.find(
    (info) => info.nombre.toLowerCase() === "direccion_local"
  );
  const horariosMañana = informacionWeb?.find(
    (info) => info.nombre.toLowerCase() === "horarios_mañana"
  );
  const horariosTarde = informacionWeb?.find(
    (info) => info.nombre.toLowerCase() === "horarios_tarde"
  );
  const datosSonCompletos = Object.values(miPerfil).every(
    (dato) => dato !== null && dato !== undefined && dato !== ""
  );

  useEffect(() => {
    const stepsConfig = {
      step1: { next: "step2", prev: "" },
      step2: { next: "step3", prev: "step1" },
      step3: { next: "step4", prev: "step2" },
      step4: { next: "", prev: "step3" },
    };
    const { next, prev } = stepsConfig[step] || {};
    setNext(next);
    setPrev(prev);
  }, [step]);

  const [next, setNext] = useState("step2");
  const [prev, setPrev] = useState("");

  const avanzar = () => next && setStep(next);
  const retroceder = () => prev && setStep(prev);

  const [cityComprador, setCityComprador] = useState("");
  const [paisComprador, setPaisComprador] = useState("");
  const [country, setCountry] = useState("");
  const [monedaComprador, setMonedaComprador] = useState("");

  const [ipResponse, setIpResponse] = useState("");

  const obtenerIp = async () => {
    const response = await axiosInstance.get("https://ipinfo.io/json");
    setIpResponse(response);
  };

  useEffect(() => {
    obtenerIp();
  }, [location, navigate]);

  useEffect(() => {
    if (!ipResponse) return;
    setCityComprador(ipResponse?.data.city);
    setPaisComprador(ipResponse.data.timezone);
    setCountry(ipResponse.data.country);
    setMonedaComprador(ipResponse.data.country);
  }, [ipResponse]);

  useEffect(() => {
    if (informacionWeb && informacionWeb.length > 0) {
      const direccion = informacionWeb?.find(
        (inf) => inf.nombre.toLowerCase() === "direccion_local"
      );
      const pais = informacionWeb?.find(
        (inf) => inf.nombre.toLowerCase() === "pais"
      );
      const ciudad = informacionWeb?.find(
        (inf) => inf.nombre.toLowerCase() === "ciudad"
      );
      const telefono = informacionWeb?.find(
        (inf) => inf.nombre.toLowerCase() === "telefono"
      );
      const nombreEmpresa = informacionWeb?.find(
        (inf) => inf.nombre.toLowerCase() === "nombre_empresa"
      );
      const email = informacionWeb?.find(
        (inf) => inf.nombre.toLowerCase() === "correo_sitio"
      );

      if (direccion && ciudad && pais && telefono && nombreEmpresa && email) {
        setDatosEmpresa({
          nombre: { contenido: nombreEmpresa.contenido },
          pais: { contenido: pais.contenido },
          ciudad: { contenido: ciudad.contenido },
          telefono: { contenido: telefono.contenido },
          direccion: { contenido: direccion.contenido },
          email: { contenido: email.contenido },
          moneda_local: { contenido: monedaComprador || "ARS" },
        });
      }

      const monedaLocal = informacionWeb?.find(
        (inf) => inf.nombre.toLowerCase() === "moneda_local"
      );

      if (
        monedaLocal &&
        monedaComprador &&
        monedaComprador === monedaLocal.contenido
      ) {
        const impuestoDato = informacionWeb?.find(
          (inf) => inf.nombre.toLowerCase() === "impuesto"
        );
        setImpuesto(impuestoDato.contenido);
      }
    }
  }, [informacionWeb, location, navigate, monedaComprador]);

  useEffect(() => {
    const nuevoPrecio =
      precio -
      precio * (descuento / 100) +
      precioEnvio +
      precio * (impuesto / 100);
    setPrecioFinal(Number(nuevoPrecio.toFixed(2)));
    setPrecioFinalSinImpuesto(Number((precio - precio * (descuento / 100)).toFixed(2)));
  }, [precio, precioEnvio, impuesto, descuento]);

  useEffect(() => {
    if (formData.finalEnvio === "Envío a domicilio" && barrios) {
      const barrioSeleccionado = barrios.find((b) => b.id === miPerfil.barrio);
      if (barrioSeleccionado) {
        setPrecioEnvio(Number(barrioSeleccionado.precio));
        setMensajeEnvio(
          `El costo de envío al barrio ${barrioSeleccionado.nombre} es de $${barrioSeleccionado.precio}`
        );
      }
    } else if (formData.finalEnvio === "Retiro en local") {
      setMensajeEnvio(
        `Lugar de retiro:${"\n"}  ${direccion.contenido}${"\n"}-------------
Horarios: ${"\n"}  ${horariosMañana.contenido}${"\n"}  ${horariosTarde.contenido}`
      );
      setPrecioEnvio(0);
    } else {
      setMensajeEnvio("");
      setPrecioEnvio(0);
    }
  }, [formData.finalEnvio, formData.barrio, barrios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validarCupon = async () => {
    if (!formData.cupon) {
      setMensajeCupon("Ingresa un cupón para validar.");
      return;
    }
    try {
      const response = await API.post("validar-cupon/", {
        codigo: formData.cupon,
      });
      if (response.status === 200) {
        setCuponEncontrado(true);
        setDescuento(response.data.descuento);
        setMensajeCupon(
          `Obtuviste un descuento del ${response.data.descuento * 100}%`
        );
      }
    } catch (error) {
      setMensajeCupon(error.response?.data?.error || "El cupón no es válido.");
      setDescuento(0);
      setCuponEncontrado(false);
    }
  };

  const validarCampos = () => {
    const errors = {};
    const requiredFields = ["finalEnvio"];
    if (formData.finalEnvio === "Envío a domicilio") {
      requiredFields.push("fechaSeleccionada", "horaSeleccionada");
    } else if (formData.finalEnvio) {
      requiredFields.push("fechaSeleccionada");
    }

    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && formData[field].trim() === "")
      ) {
        errors[field] = "Este campo es obligatorio";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const barrioEncontrado = (miBarrio) => {
    const barrioEnc = barrios?.find((barrio) => barrio.id === miBarrio) || "";
    return barrioEnc.nombre;
  };

  useEffect(() => {
    const estado =
      formData.finalEnvio === "Retiro en local"
        ? "Espera-Retiro"
        : "Espera-Domicilio";

    setEstadoFinalVenta(estadosDeVenta?.find((est) => est.estado === estado));
  }, [formData.finalEnvio]);

  const handleEnviar = async () => {
    if (!validarCampos()) {
      setMensajeForm("Por favor, completa todos los campos obligatorios.");
      return;
    }
    setMensajeForm("");

    try {
      const items = productosCarrito.map((item) => ({
        producto_talle_id: item.producto_final.id,
        nombre: item.producto_final.producto.nombre,
        cantidad: item.cantidad,
        precio_unitario: Number(item.producto_final.producto.precio_final),
        subtotal:
          Number(item.producto_final.producto.precio_final) * item.cantidad,
      }));

      const response = await API.post("pago/", {
        email: user?.email,
        items,
        total: precioFinal,
        country,
        envio: {
          tipo: formData.finalEnvio,
          barrio: formData.barrio || null,
          domicilio: formData.domicilio || null,
          fecha: formData.fechaSeleccionada
            ? formData.fechaSeleccionada.toISOString().split("T")[0]
            : null,
          horario: formData.horaSeleccionada || null,
        },
      });

      if (response.data.init_point) {
        const adjustedDatosCompra = {
          ...formData,
          nombre: formData.nombre || miPerfil?.nombre_apellido || "", // Aseguramos el nombre
          telefono: formData.telefono || miPerfil?.telefono || "",   // Aseguramos el teléfono
          correo: formData.correo || user?.email || "",             // Aseguramos el correo
          domicilio: formData.domicilio || miPerfil?.domicilio || "", // Aseguramos el domicilio
          precioFinal,
          precioEnvio,
          productos: productosCarrito.map((item) => ({
            producto_final_id: item.producto_final.id,
            nombre: item.producto_final.producto.nombre,
            talle: item.producto_final.talle,
            precio_unitario: Number(item.producto_final.producto.precio_final),
            cantidad: item.cantidad,
            subtotal: Number(item.producto_final.producto.precio_final) * item.cantidad,
          })),
          datosEmpresa,
          precioFinalSinImpuesto,
          estadoFinalVenta,
          paisComprador,
          cityComprador,
          monedaComprador,
          impuesto,
          fecha_venta: new Date().toISOString(),
          fecha_entrega: formData.fechaSeleccionada?.toISOString() || null,
          horario_entrega: formData.horaSeleccionada || null,
        };

        console.log("adjustedDatosCompra antes de guardar:", adjustedDatosCompra);
        localStorage.setItem(
          "datosCompra",
          JSON.stringify(adjustedDatosCompra)
        );
        navigate("/pago-exitoso");
      } else {
        setMensajeForm("No se recibió un punto de inicio para el pago.");
      }
    } catch (error) {
      console.error(
        "Error al procesar el pago:",
        error.response?.data || error
      );
      setMensajeForm("Hubo un error al procesar el pago. Intenta nuevamente.");
    }
  };

  const horariosDisponibles = [
    "09:00 - 12:00",
    "14:00 - 17:00",
    "18:00 - 21:00",
  ];

  return (
    <div className="container-pago">
      {!datosSonCompletos ? (
        <div>
          <h3>Complete los datos faltantes en su perfil para continuar</h3>
          <button type="button" className="btn-primary">
            <a
              style={{ textDecoration: "none", color: "white" }}
              href="/Mi-cuenta"
            >
              Ir a mi cuenta
            </a>
          </button>
        </div>
      ) : (
        <>
          <div className="head-form-step">
            {["PASO 1", "PASO 2", "PASO 3", "PASO 4"].map((label, index) => (
              <div
                key={label}
                className={`step ${step === `step${index + 1}` ? "active" : ""}`}
              >
                {label}
              </div>
            ))}
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {step === "step1" && (
              <>
                <h2 style={{ color: "#ff7675" }}>Verifica tus datos</h2>
                <div className="form-group datos">
                  <h4>{miPerfil.nombre_apellido}</h4>
                  <h4>DNI: {miPerfil.dni}</h4>
                  <h4>Teléfono: {miPerfil.telefono}</h4>
                  <h4>Barrio: {barrioEncontrado(miPerfil.barrio)}</h4>
                  <h4>Domicilio: {miPerfil.domicilio}</h4>
                </div>
              </>
            )}

            {step === "step2" && (
              <>
                <div className="form-group">
                  <label htmlFor="finalEnvio">Forma de envío</label>
                  <select
                    name="finalEnvio"
                    id="finalEnvio"
                    value={formData.finalEnvio}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">-- Selecciona una opción --</option>
                    {envio.map((en) => (
                      <option key={en.id} value={en.nombre}>
                        {en.nombre}
                      </option>
                    ))}
                  </select>
                  {formErrors.finalEnvio && (
                    <p className="error">{formErrors.finalEnvio}</p>
                  )}
                  {mensajeEnvio && (
                    <p className="price-message">{mensajeEnvio}</p>
                  )}
                </div>
              </>
            )}

            {step === "step3" && (
              <>
                <div className="form-group">
                  <label>
                    Fecha de{" "}
                    {formData.finalEnvio === "Envío a domicilio"
                      ? "entrega"
                      : "retiro"}
                  </label>
                  <DatePicker
                    selected={formData.fechaSeleccionada}
                    onChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        fechaSeleccionada: date,
                      }))
                    }
                    minDate={new Date()}
                    locale="es"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecciona una fecha"
                    className="form-input"
                    required
                  />
                  {formErrors.fechaSeleccionada && (
                    <p className="error">
                      {formErrors.fechaSeleccionada}
                    </p>
                  )}
                </div>

                {formData.finalEnvio === "Envío a domicilio" && (
                  <div className="form-group">
                    <label htmlFor="horaSeleccionada">Horario de entrega</label>
                    <select
                      name="horaSeleccionada"
                      id="horaSeleccionada"
                      value={formData.horaSeleccionada}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="">-- Selecciona un horario --</option>
                      {horariosDisponibles.map((horario) => (
                        <option key={horario} value={horario}>
                          {horario}
                        </option>
                      ))}
                    </select>
                    {formErrors.horaSeleccionada && (
                      <p className="error">
                        {formErrors.horaSeleccionada}
                      </p>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="cupon">
                    ¿Tenés un cupón de descuento? Úsalo
                  </label>
                  <div >
                    <input
                      type="text"
                      name="cupon"
                      id="cupon"
                      value={formData.cupon}
                      onChange={handleChange}
                      className="form-input"
                      style={{ width: "50%" }}
                      placeholder="Ingresa tu cupón"
                    />
                    <button
                      type="button"
                      style={{ width: "20%", marginLeft: "5%" }}
                      onClick={validarCupon}
                    >
                      Validar
                    </button>
                  </div>
                  {mensajeCupon && (
                    <p
                      className="error"
                      style={{ color: cuponEncontrado ? "green" : "red" }}
                    >
                      {mensajeCupon}
                    </p>
                  )}
                </div>
              </>
            )}

            {step === "step4" && (
              <div className="carrito-container-pago">
                <h2>Productos a comprar</h2>
                <ul className="carrito-list">
                  {productosCarrito.map((item) => (
                    <li key={item.id} className="carrito-item-compra-pago">
                      <p style={{ color: "black" }}>
                        {item.producto_final.producto.nombre} (Talle:{" "}
                        {item.producto_final.talle})
                      </p>
                      <p style={{ color: "darkslategrey" }}>
                        Subtotal: $
                        {item.producto_final.producto.precio_final *
                          item.cantidad}
                      </p>
                    </li>
                  ))}
                  <li className="carrito-item-compra-pago">
                    <p style={{ color: "black" }}>Costo de envío</p>
                    <p style={{ color: "darkslategrey" }}>
                      Subtotal: ${precioEnvio}
                    </p>
                  </li>
                  {descuento > 0 && (
                    <li className="carrito-item-compra-pago">
                      <p style={{ color: "green" }}>Descuento por cupón</p>
                      <p style={{ color: "green" }}>
                        - ${(descuento * precio).toFixed(2)}
                      </p>
                    </li>
                  )}
                  <li className="carrito-item-compra-pago">
                    <p style={{ color: "red" }}>Impuestos</p>
                    <p style={{ color: "red" }}>{impuesto}%</p>
                  </li>
                </ul>
                <h2>Precio Total</h2>
                <h3>
                  {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  }).format(precioFinal)}
                </h3>
              </div>
            )}

            <div className="step-buttons">
              {prev && (
                <button type="button" className="btn-back" onClick={retroceder}>
                  Atrás
                </button>
              )}
              {step === "step4" ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleEnviar}
                >
                  COMPRAR
                </button>
              ) : (
                <button type="button" className="btn-primary" onClick={avanzar}>
                  Siguiente
                </button>
              )}
            </div>

            {mensajeForm && (
              <p className="error-message color-red">{mensajeForm}</p>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default FormularioCompra;