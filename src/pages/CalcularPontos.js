export default function CalcularPontos(foto, materiais) {
  let pontos = 0;

 //Calcula os pontos marcados com base no registro
 //Foto da coleta = 100 pontos
  if (foto) {
    pontos += 100;
  }

  // Para cada material selecionado soma 50 pontos
  Object.values(materiais).forEach((marcado) => {
    if (marcado) {
      pontos += 50;
    }
  });

  return pontos;
}
