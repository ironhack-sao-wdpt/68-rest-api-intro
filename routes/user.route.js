const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const OrderModel = require("../models/Order.model");
const UserModel = require("../models/User.model");
const generateToken = require("../config/jwt.config");
const isAuthenticated = require("../middlewares/isAuthenticated");

// REST => Stateless

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
    const { email, password } = req.body;
    // 1. Verificar se o usuário já se cadastrou na nossa plataforma
    const user = await UserModel.findOne({ email });

    if (!user) {
      // 401: Unauthorized
      return res.status(401).json({ msg: "E-mail ou senha incorretos" }); // melhorar depois
    }

    // 2. Verificar se as senhas coincidem
    if (!bcrypt.compareSync(password, user.passwordHash)) {
      // 401: Unauthorized

      // Por questões de segurança não informamos ao usuário se ele errou a senha ou o email para não ceder a informação de que o e-mail está correto para um potencial usuário malicioso que está tentando invadir uma conta
      return res.status(401).json({ msg: "E-mail ou senha incorretos" }); // melhorar depois
    }

    // 3. Assinar o token e enviá-lo como sucesso do login

    const token = generateToken(user);

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Não foi possível realizar o login" });
  }
});

router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const { _id } = req.user;

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
