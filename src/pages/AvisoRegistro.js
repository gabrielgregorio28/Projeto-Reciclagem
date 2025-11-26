import "./AvisoRegistro.css";

export default function ModalSucesso({ pontos, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-caixa">

        <h2 className="modal-titulo">Registro Concluído!</h2>

        <p className="modal-texto">
          Sua coleta foi registrada com sucesso.
        </p>

        <p className="modal-pontos">
          Você ganhou <strong>{pontos}</strong> pontos!
        </p>

        <button className="modal-btn-fechar" onClick={onClose}>
          Fechar
        </button>

      </div>
    </div>
  );
}
