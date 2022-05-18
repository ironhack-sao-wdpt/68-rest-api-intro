const jwt = require("jsonwebtoken");

function extractTokenFromHeaders(req, res) {
  const Authorization = req.headers.authorization;

  if (!Authorization) {
    return res.status(401).json({ msg: "Faltando cabeçalho de autorização" });
  }

  const token = Authorization.split(" ")[1];

  return token;
}

module.exports = function (req, res, next) {
  // 1. Extrair o token do cabeçalho

  const token = extractTokenFromHeaders(req, res);

  // 2. Validar o token
  jwt.verify(token, process.env.TOKEN_SIGN_SECRET, (err, decoded) => {
    // 3. Se o token for inválido, retorne um erro de autenticação
    if (err) {
      return res.status(401).json({ msg: err });
    }

    // 4. Se for válido, passe para a próxima função handler de rota
    req.user = decoded;
    next();
  });
};
