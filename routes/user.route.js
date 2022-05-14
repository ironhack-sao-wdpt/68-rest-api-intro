const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const OrderModel = require("../models/Order.model");
const UserModel = require("../models/User.model");

router.post("/signup", async (req, res) => {
  try {
    // Extrai a senha em texto claro, que só vai servir para gerar o hash e depois nossa aplicação nunca mais vai ter conhecimento da senha original
    const { name, email, password } = req.body;

    // 1. Verificar se o email já está cadastrado (a cláusula unique no Schema já faz isso)

    // 2. Gerar o salt e hashear a senha
    const salt = bcrypt.genSaltSync(saltRounds);

    const hash = bcrypt.hashSync(password, salt);

    // 3. Armazenar os dados do usuário e somente a senha criptografada
    const result = await UserModel.create({ name, email, passwordHash: hash });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Não foi possível salvar o usuário" });
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    // To do
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Não foi possível realizar o login" });
  }
});

router.get("/profile/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    const result = await UserModel.findOne({ _id }).populate("orders"); // 'orders' é o nome do campo (propriedade do objeto de Schema) que possui a referência ao outro modelo

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Não foi possível salvar o usuário" });
  }
});

router.delete("/user/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    const result = await UserModel.deleteOne({ _id });

    if (!result.deletedCount) {
      return res.status(404).json({ msg: "Usuário inexistente" });
    }

    const ordersResult = await OrderModel.deleteMany({ userId: _id });

    console.log("USER DELETE => ", result);
    console.log("ORDERS DELETE => ", ordersResult);

    return res.status(200).json({});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Não foi possível salvar o usuário" });
  }
});

module.exports = router;
