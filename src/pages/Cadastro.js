import { useState } from "react";
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import "./Cadastro.css";

export default function Login() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function cadastrarUsuario(e) {
    e.preventDefault();

    try {
      //Criar usuário no Firebase Auth
      const credenciais = await createUserWithEmailAndPassword(auth, email, senha);
      const user = credenciais.user;

      //Salvar o nome no perfil do Auth
      await updateProfile(user, {
        displayName: nome,
      });

      //Salvar dados no Realtime Database
      await set(ref(db, "usuarios/" + user.uid), {
        nome: nome,
        email: email,
      });

      alert("Cadastro realizado com sucesso!");

      //Redirecionar para homepage depois do login efetuado
      navigate("/");

    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
      alert("Erro ao cadastrar usuário: " + erro.message);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">LOGIN</h1>

        <form onSubmit={cadastrarUsuario} className="login-form">
          
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

           <button className="bt-login">Cadastrar</button>

        </form>
      </div>
    </div>
  );
}
