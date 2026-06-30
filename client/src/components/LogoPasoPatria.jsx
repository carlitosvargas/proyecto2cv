import './LogoPasoPatria.css';

const LogoPasoPatria = ({ className = '' }) => {
  return (
    <div className={`logo-paso-patria ${className}`}>
      <div className="logo-linea-1">
        <span className="letra c-rojo">G</span>
        <span className="letra c-naranja">uía</span>
      </div>
      <div className="logo-linea-2">
        <span className="letra c-verde-claro">T</span>
        <span className="letra c-verde-oscuro">U</span>
        <span className="letra c-celeste">R</span>
        <span className="letra c-azul-claro">ÍS</span>
        <span className="letra c-azul-medio">TI</span>
        <span className="letra c-azul-oscuro">CA</span>
      </div>
    </div>
  );
};

export default LogoPasoPatria;
