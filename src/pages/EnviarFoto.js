import { useState } from "react";
import { Upload, ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getDatabase, push, ref } from "firebase/database";
import { auth } from "../Firebase";   // ✔ agora usa o Firebase Auth
import "./EnviarFoto.css";
import CalcularPontos from "../pages/CalcularPontos";
import AvisoRegistro from "../pages/AvisoRegistro";

export default function EnviarFoto() {
  const [foto, setFoto] = useState(null);
  const [materiais, setMateriais] = useState({
    papel: false,
    plastico: false,
    metal: false,
    vidro: false,
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pontosGanhos, setPontosGanhos] = useState(0);

  // 🔥 Agora o UID vem do Firebase Authentication
  const user = auth.currentUser;
  const userId = user?.uid; // já está logado, então sempre existe

  const db = getDatabase();
  const coletasRef = ref(db, "coletas/" + userId);

  function handleArquivo(e) {
    setFoto(e.target.files[0]);
  }

  function abrirSeletor() {
    document.getElementById("inputArquivo").click();
  }

  function removerFoto() {
    setFoto(null);
    document.getElementById("inputArquivo").value = "";
  }

  function handleMaterial(e) {
    setMateriais({
      ...materiais,
      [e.target.name]: e.target.checked,
    });
  }

  // -------------------------------
  // FUNÇÃO PRINCIPAL DE ENVIAR FOTO
  // -------------------------------
  async function enviarFoto() {
    if (!foto) {
      alert("Selecione uma foto antes de enviar!");
      return;
    }

    try {
      // 1️⃣ Envia foto para o Cloudinary
      const formData = new FormData();
      formData.append("file", foto);
      formData.append("upload_preset", "Projeto_Reciclagem");

      const resposta = await fetch(
        "https://api.cloudinary.com/v1_1/daqskeiki/image/upload",
        { method: "POST", body: formData }
      );

      const dados = await resposta.json();

      if (!dados.secure_url) {
        alert("Erro ao enviar a foto para o Cloudinary");
        return;
      }

      const urlFoto = dados.secure_url;

      // 2️⃣ Calcula pontos
      const pontos = CalcularPontos(foto, materiais);

      // 3️⃣ Salva no Firebase dentro do UID do usuário autenticado
      await push(coletasRef, {
        fotoUrl: urlFoto,
        materiais,
        pontos,
        data: new Date().toISOString(),
      });

      // 4️⃣ Mostra modal de sucesso
      setPontosGanhos(pontos);
      setMostrarModal(true);

    } catch (error) {
      console.error(error);
      alert("Erro ao enviar a foto.");
    }
  }

  return (
    <div className="container-enviar">

      <Link to="/" className="btn-voltar">
        <ArrowLeft size={20} />
        Voltar
      </Link>

      <h1 className="titulo">Fazer Registro de Coleta</h1>

      <button className="btn-selecionar" onClick={abrirSeletor}>
        <Upload size={24} />
        Selecionar Foto
      </button>

      <input
        id="inputArquivo"
        type="file"
        accept="image/*"
        onChange={handleArquivo}
        style={{ display: "none" }}
      />

      {foto && (
        <div className="arquivo">
          <span>Foto selecionada: {foto.name}</span>
          <button className="btn-remover" onClick={removerFoto}>
            <X size={18} />
          </button>
        </div>
      )}

      <div className="lista-materiais">
        <label><input type="checkbox" name="papel" onChange={handleMaterial} /> Papel</label>
        <label><input type="checkbox" name="plastico" onChange={handleMaterial} /> Plástico</label>
        <label><input type="checkbox" name="metal" onChange={handleMaterial} /> Metal</label>
        <label><input type="checkbox" name="vidro" onChange={handleMaterial} /> Vidro</label>
      </div>

      <button className="btn-registro-coleta" onClick={enviarFoto}>
        Enviar Coleta
      </button>

      {mostrarModal && (
        <AvisoRegistro
          pontos={pontosGanhos}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}
