const { Schema, model, Types } = require("mongoose");

const OrderSchema = new Schema(
  {
    status: { type: String, default: "PAYMENT PENDING" },
    userId: { type: Types.ObjectId, ref: "User" }, // O valor de "ref" é o nome do modelo referenciado, ou seja, a string passada como primeiro argumento para a função "model()",
    products: [
      new Schema(
        {
          productId: { type: Types.ObjectId, ref: "Product" },
          quantity: { type: Number, min: 1 },
        },
        { _id: false } // Evita que cada objeto criado por esse Schema tenha um _id gerado automaticamente
      ),
    ],
  },
  { timestamps: true } // Gravar a data e hora de criação de cada documento dessa coleção
);

module.exports = model("Order", OrderSchema);
