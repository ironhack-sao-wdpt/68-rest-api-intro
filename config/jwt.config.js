const jwt = require("jsonwebtoken");

function generateToken({ _id, name, email }) {
  // 1. Definir o payload
  // 2. Qual a senha pra fazer a assinatura
  // 3. Qual a data de validade desse token?

  // OBS.: O token sign secret é uma informação secreta e sensível e NUNCA deve ser enviada para o Github. Por isso estamos armazenando essa informação em variáveis de ambiente

  return jwt.sign({ _id, name, email }, process.env.TOKEN_SIGN_SECRET, {
    expiresIn: "6h",
  });
}

module.exports = generateToken;
