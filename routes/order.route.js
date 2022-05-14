const router = require("express").Router();
const OrderModel = require("../models/Order.model");
const UserModel = require("../models/User.model");

router.post("/order", async (req, res) => {
  try {
    const data = req.body;

    // Insere o novo pedido no banco
    const result = await OrderModel.create(data);

    // Atualizar a array de referências de pedidos do usuário
    const updateResult = await UserModel.findOneAndUpdate(
      { _id: data.userId },
      { $push: { orders: result._id } },
      { new: true, runValidators: true }
    );

    console.log("Usuário atualizado => ", updateResult);

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Não foi possível salvar o pedido" });
  }
});

router.get("/my-orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await OrderModel.find({ userId }).populate(
      "products.productId"
    );

    return res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Não foi possível encontrar os pedidos" });
  }
});

module.exports = router;
