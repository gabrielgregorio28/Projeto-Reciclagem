export default function CalcularPontos(foto, materiais) {
  let pontos = 0;

  // 100 pontos se tiver foto
  if (foto) {
    pontos += 100;
  }

  // Para cada material marcado: +50 pontos
  Object.values(materiais).forEach((marcado) => {
    if (marcado) {
      pontos += 50;
    }
  });

  return pontos;
}
