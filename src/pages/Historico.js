import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { Link } from "react-router-dom";
import { auth } from "../Firebase";   // ✔ Agora usa o Firebase Auth
import "./Historico.css";

export default function Historico() {
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  // ---- Função para excluir um registro ----
  function excluirRegistroConfirmado() {
    if (!idParaExcluir) return;

    const userId = auth.currentUser?.uid; // 🔥 UID genuíno do usuário logado
    if (!userId) return; // segurança

    const db = getDatabase();
    const refItem = ref(db, `coletas/${userId}/${idParaExcluir}`);

    remove(refItem);
    setIdParaExcluir(null);
  }

  // ---- Buscar histórico ----
  useEffect(() => {
    const userId = auth.currentUser?.uid; // 🔥 obtém o UID real
    if (!userId) return;

    const db = getDatabase();
    const coletasRef = ref(db, "coletas/" + userId);

    onValue(coletasRef, (snapshot) => {
      if (snapshot.exists()) {
        const dados = snapshot.val();

        const lista = Object.keys(dados).map((id) => ({
          id,
          ...dados[id],
        }));

        lista.sort((a, b) => new Date(b.data) - new Date(a.data));

        setHistorico(lista);
      } else {
        setHistorico([]);
      }

      setCarregando(false);
    });
  }, []);

  function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="historico-container">
      
      <div className="header-historico">
        <h1 className="titulo-historico">Histórico de Coletas</h1>
        
        <Link to="/" className="botao-voltar-historico">
          <span className="seta-esquerda">←</span> Voltar
        </Link>
      </div>

      {carregando ? (
        <p>Carregando...</p>
      ) : historico.length === 0 ? (
        <p>Nenhum registro encontrado.</p>
      ) : (
        <ul className="lista-coletas">
          {historico.map((item) => (
            <li key={item.id} className="item-coleta">
              
              <img
                src={item.fotoUrl}
                alt="Foto da coleta"
                className="foto-coleta"
              />

              <div className="info-coleta">
                <p className="data-coleta">{formatarData(item.data)}</p>

                <p className="materiais-coleta">
                  Materiais:{" "}
                  {Object.keys(item.materiais)
                    .filter((m) => item.materiais[m])
                    .join(", ")}
                </p>

                <p className="pontos-coleta">
                  <strong>+ {item.pontos} pts</strong>
                </p>
              </div>

              <button
                className="botao-excluir"
                onClick={() => setIdParaExcluir(item.id)}
              >
                Excluir Registro
              </button>

            </li>
          ))}
        </ul>
      )}

      {idParaExcluir && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Você deseja realmente excluir o registro?</p>

            <div className="popup-botoes">
              <button className="popup-sim" onClick={excluirRegistroConfirmado}>
                Sim
              </button>

              <button
                className="popup-nao"
                onClick={() => setIdParaExcluir(null)}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
