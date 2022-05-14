const mongoose = require("mongoose");

// 1. Definir o Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, maxlength: 500, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }],
});

// 2. Criar e exportar o model
const User = mongoose.model("User", UserSchema);

module.exports = User;
