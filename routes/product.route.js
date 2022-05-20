const router = require("express").Router();
const ProductModel = require("../models/Product.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Configurar rotas da API

// Crud (Create) - POST
router.post("/product", isAuthenticated, async (req, res) => {
  try {
    // 1. Extrair as informações do corpo da requisição
    const data = req.body;

    // 2. Inserir estas informações no banco
    const result = await ProductModel.create(data);

    // 3. Responder o resultado
    // 201: Created
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Falha ao cadastrar produto" });
  }
});

// cRud (Read) - GET de todos os produtos
router.get("/product", isAuthenticated, async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = Number(page) || 0;
    limit = Number(limit) || 20;

    const products = await ProductModel.find()
      .skip(page * limit)
      .limit(limit);

    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Falha ao buscar produtos" });
  }
});

// cRud (Read) - GET filtrado por id do produto
router.get("/product/:_id", isAuthenticated, async (req, res) => {
  try {
    // Extrai o id da URL
    const { _id } = req.params;

    // Busca o documento com esse id
    const product = await ProductModel.findOne({ _id }); // no JS ES+, quando a chave de um objeto tem o mesmo nome que a variável sendo passada como valor, não precisamos passar o valor dessa chave.

    // Caso não exista, retorna erro 404
    if (!product) {
      return res.status(404).json({ msg: "Produto não encontrado!" });
    }

    // Caso exista, retorna o próprio documento
    return res.status(200).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Falha ao buscar produtos" });
  }
});

// crUd (Update) - PATCH (atualização não-destrutiva)

router.patch("/product/:_id", isAuthenticated, async (req, res) => {
  try {
    // 1. Extrair o id da URL
    const { _id } = req.params;

    const data = req.body;

    // 2. Atualizar o produto com esse id usando os dados do corpo da requisição
    const result = await ProductModel.findOneAndUpdate(
      { _id },
      { $set: data },
      { new: true, runValidators: true }
    ); // runValidators força o mongoose a rodar as regras do Schema também na atualização e não somente na criação

    // 3. Caso nenhum documento for encontrado, retorna 404
    if (!result) {
      return res.status(404).json({ msg: "Produto não encontrado" });
    }

    // 4. Responde o objeto atualizado
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Falha ao editar produto" });
  }
});

// crUd (Update) - PUT (atualização destrutiva (substituição))

router.put("/product/:_id", isAuthenticated, async (req, res) => {
  try {
    // 1. Extrair o id da URL
    const { _id } = req.params;

    const data = req.body;

    // 2. Atualizar o produto com esse id usando os dados do corpo da requisição
    // Como no PUT é esperado que o valor enviado substitua o valor original, precisamos usar outro método ao invés do update
    const result = await ProductModel.findOneAndReplace({ _id }, data, {
      new: true,
      runValidators: true,
    }); // runValidators força o mongoose a rodar as regras do Schema também na atualização e não somente na criação

    // 3. Caso nenhum documento for encontrado, retorna 404
    if (!result) {
      return res.status(404).json({ msg: "Produto não encontrado" });
    }

    // 4. Responde o objeto atualizado
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Falha ao editar produto" });
  }
});

// cruD (Delete) - DELETE
router.delete("/product/:_id", isAuthenticated, async (req, res) => {
  try {
    // 1. Extrair o id da URL
    const { _id } = req.params;

    const result = await ProductModel.deleteOne({ _id });

    if (result.deletedCount < 1) {
      return res.status(404).json({ msg: "Produto não encontrado" });
    }

    return res.status(200).json({});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Falha ao editar produto" });
  }
});

module.exports = router;
