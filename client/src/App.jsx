import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarraNavegacion from './components/BarraNavegacion';
import Inicio from './pages/Inicio';
import DetalleUbicacion from './pages/DetalleUbicacion';
import IniciarSesion from './pages/IniciarSesion';
import PanelAdministrador from './pages/PanelAdministrador';
import RutaProtegida from './components/RutaProtegida';
import { ProveedorAutenticacion } from './context/ContextoAutenticacion';

function App() {
  return (
    <ProveedorAutenticacion>
      <Router>
        <BarraNavegacion />
        <main style={{ minHeight: 'calc(100vh - 64px)', paddingTop: '64px' }}>
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
      </Router>
    </ProveedorAutenticacion>
  );
}

export default App;
