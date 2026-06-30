import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarraNavegacion from './components/BarraNavegacion';
import Inicio from './pages/Inicio';
import DetalleUbicacion from './pages/DetalleUbicacion';
import IniciarSesion from './pages/IniciarSesion';
import PanelAdministrador from './pages/PanelAdministrador';
import RutaProtegida from './components/RutaProtegida';
import PieDePagina from './components/PieDePagina';
import { ProveedorAutenticacion } from './context/ContextoAutenticacion';

function App() {
  return (
    <ProveedorAutenticacion>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <BarraNavegacion />
          <main style={{ flex: 1, paddingTop: '64px' }}>
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/ubicacion/:id" element={<DetalleUbicacion />} />
              <Route path="/iniciar-sesion" element={<IniciarSesion />} />
              <Route path="/administrador" element={
                <RutaProtegida soloAdministrador={true}>
                  <PanelAdministrador />
                </RutaProtegida>
              } />
            </Routes>
          </main>
          <PieDePagina />
        </div>
      </Router>
    </ProveedorAutenticacion>
  );
}

export default App;
