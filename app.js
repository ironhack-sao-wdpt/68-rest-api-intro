// Carrega as variáveis de ambiente presentes no arquivo .env
require("dotenv").config();

// 1. Importar o pacote Express
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// 2. Instanciar o Express
const app = express();

// 3. Configurar o servidor para aceitar JSON
app.use(express.json());

// Cross Origin Resource Sharing
// Cross Origin = Entre origens ('domínios') diferentes
// Resource = HTML, CSS, imagens, fontes, JSON
// Sharing = Compartilhamento
app.use(cors({ origin: process.env.REACT_APP_URL })); //OBS.: NÃO COLOCAR BARRA NO FINAL DO DOMÍNIO

// Configura o servidor para criar um log de cada requisição recebida
app.use(morgan("combined"));

// 5. Configurar as rotas (endpoints) de API
const productRouter = require("./routes/product.route");
const userRouter = require("./routes/user.route");
const orderRouter = require("./routes/order.route");
// Redireciona todas as requisições para o roteador configurado no arquivo 'product.route.js'
app.use("/", productRouter);
app.use("/", userRouter);
app.use("/", orderRouter);

// 4. Conectar com o banco de dados
const connectToDB = require("./config/db.config");

// Só inicializa o servidor Express se a conexão com o banco for bem-sucedida
connectToDB().then(() => {
  // 6. Subir o servidor para escutar requisições na porta 4000

  app.listen(process.env.PORT, () =>
    console.log("Servidor rodando na porta ", process.env.PORT)
  );
});
