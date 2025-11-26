import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import EnviarFoto from './pages/EnviarFoto';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Historico from "./pages/Historico";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/EnviarFoto" element={<EnviarFoto />} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Historico" element={<Historico />} />
      </Routes>
    </Router>
  );
}
export default App;