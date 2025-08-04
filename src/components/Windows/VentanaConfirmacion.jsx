export const VentanaConfirmacion = ({ mensaje, cancelar, confirmar }) => {
  return (
    <div>
      <h2>{mensaje}</h2>
      <div className="d-flex ">
        <button onClick={cancelar}>Cancelar</button>
        <button onClick={confirmar}>Confirmar</button>
      </div>
    </div>
  );
};
