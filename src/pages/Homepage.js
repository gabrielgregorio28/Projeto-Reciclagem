import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

import "./Homepage.css";

export default function Homepage() {
  const [usuario, setUsuario] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    const auth = getAuth();

    // Detecta login automaticamente
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);

        // Buscar nome no Firebase
        const db = getDatabase();
        const refNome = ref(db, "usuarios/" + user.uid + "/nome");

        onValue(refNome, (snapshot) => {
          if (snapshot.exists()) {
            setNomeUsuario(snapshot.val());
          }
        });
      } else {
        setUsuario(null);
        setNomeUsuario("");
      }
    });
  }, []);

  function sair() {
    const auth = getAuth();
    signOut(auth);
  }

  return (
    <div className="home-container">
      
      <header className="header">
        <h2 className="logo">Reciclos</h2>

        {/* SE ESTIVER LOGADO → mostra nome + sair */}
        {usuario ? (
          <div className="area-logado">
            <span className="nome-usuario">
              Olá, <strong>{nomeUsuario}</strong>
            </span>

            <button className="btn-sair" onClick={sair}>
              Sair
            </button>
          </div>
        ) : (
          // SE NÃO ESTIVER LOGADO → mostra ENTRAR
          <Link to="/login">
            <button className="btn-cadastro btn-header">Entrar</button>
          </Link>
        )}
      </header>

      <main className="main-content">
        <Link to="/EnviarFoto">
          <button className="btn-enviar">Registrar Coleta</button>
        </Link>

        <Link to="/Historico">
          <button className="btn-enviar">Histórico de Coletas</button>
        </Link>
      </main>

    </div>
  );
}
