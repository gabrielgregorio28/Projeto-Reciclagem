import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import "./Homepage.css";

export default function Homepage() {
  const [usuario, setUsuario] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false); // controla popup
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);

        // Buscar nome no Firebase
        const db = getDatabase();
        const refNome = ref(db, "usuarios/" + user.uid + "/nome");

        onValue(refNome, (snapshot) => {
          if (snapshot.exists()) {
            setNomeUsuario(snapshot.val());
          } else {
            setNomeUsuario("");
          }
        });
      } else {
        setUsuario(null);
        setNomeUsuario("");
      }
    });

    return () => unsub();
  }, []);

  // chamada quando confirma logout
  async function confirmarLogout() {
    const auth = getAuth();
    try {
      await signOut(auth);
      setConfirmLogout(false);
      navigate("/login");
    } catch (err) {
      console.error("Erro ao sair:", err);
      setConfirmLogout(false);
    }
  }

  return (
    <div className="home-container">
      <header className="header">
        <h2 className="logo">Reciclos</h2>

        {/* Se o usuário estiver logado mostra o nome e  a opção de sair */}
        {usuario ? (
          <div className="area-logado">
            <span className="nome-usuario">
              Olá, <strong>{nomeUsuario || usuario.email}</strong>
            </span>

            {/*Mostra a tela perguntando se o usuário realmente deseja sair*/}
            <button
              className="btn-sair"
              onClick={() => setConfirmLogout(true)}
            >
              Sair
            </button>
          </div>
        ) : (
          // Se não estiver logado mostra o Botão entrar
          <Link to="/login">
            <button className="btn-cadastro btn-header">Entrar</button>
          </Link>
        )}
      </header>

        {/*Botões principais */}
      <main className="main-content">
        <Link to="/EnviarFoto">
          <button className="btn-enviar">Registrar Coleta</button>
        </Link>

        <Link to="/Historico">
          <button className="btn-enviar">Histórico de Coletas</button>
        </Link>

      </main>

      {/* Mensagem para confirmar se o usuário realmente deseja sair*/}
      {confirmLogout && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Você deseja realmente sair da conta?</p>

            <div className="popup-botoes">
              <button className="popup-sim" onClick={confirmarLogout}>
                Sim
              </button>

              <button className="popup-nao" onClick={() => setConfirmLogout(false)}>
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
