export default function getUserId() {
  // tenta pegar um ID salvo
  let id = localStorage.getItem("userId");

  // se não existir ainda, cria um novo
  if (!id) {
    id = "user_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("userId", id);
  }

  return id;
}


