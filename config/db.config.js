// 1. Importar o pacote Mongoose
const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb://172.23.16.1:27017/rest-intro"
    ); // No lugar de '172.27.160.1' no seu código, provavelmente você usará 'localhost', a menos que seu servidor MongoDB esteja rodando em outra máquina diferente da máquina executando este projeto.

    console.log(`Conectado ao banco: ${connection.connections[0].name}`);
  } catch (err) {
    console.error("Falha ao conectar com o MongoDB!");
    console.error(err);
    // Se a conexão com o banco de dados falhar, derrube o servidor
    process.exit(1);
  }
};
