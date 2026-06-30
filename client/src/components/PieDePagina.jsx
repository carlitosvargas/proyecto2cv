import { Globe, MessageCircle, Camera, Mail } from 'lucide-react';
import LogoPasoPatria from './LogoPasoPatria';
import './PieDePagina.css';

const PieDePagina = () => {
  return (
    <footer className="pie-de-pagina">
      <div className="contenedor pie-contenido">

        <div className="pie-seccion">
          <LogoPasoPatria className="logo-pie" />
          <p style={{ marginTop: '1rem' }}>Descubre los rincones más hermosos de nuestra ciudad. Explora monumentos, parques, y gastronomía con facilidad.</p>
        </div>

        <div className="pie-seccion">
          <h3>Síguenos en nuestras redes</h3>
          <div className="redes-sociales">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="icono-red hover-facebook">
              <Globe size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="icono-red hover-twitter">
              <MessageCircle size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="icono-red hover-instagram">
              <Camera size={20} />
            </a>
            <a href="mailto:contacto@guiaturistica.com" className="icono-red hover-mail">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="pie-seccion seccion-logo-extra">
          <img src="/logo-paso-patria.png" alt="Paso de la Patria" className="img-logo-redes" />
        </div>

      </div>

      <div className="pie-inferior">
        <div className="pie-inferior-contenido">
          <div className="texto-inferior">
            <p>
              Desarrollado por <strong>Lic. Vargas Carlos Esteban</strong>
            </p>
            <p className="copyright">© {new Date().getFullYear()} Todos los derechos reservados.</p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default PieDePagina;
