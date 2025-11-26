import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function fazerLogin(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/"); // vai para homepage
    } catch (erro) {
      console.error("Erro ao fazer login:", erro);
      alert("E-mail ou senha inválidos!");
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">

        <h1 className="login-title">LOGIN</h1>

        <form onSubmit={fazerLogin} className="login-form">

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

          <button className="bt-login">Entrar</button>

        </form>

        {/* BOTÃO DE CADASTRO */}
        <button
          className="bt-login"
          onClick={() => navigate("/Cadastro")}
        >
          Criar conta
        </button>

      </div>
    </div>
  );
}
