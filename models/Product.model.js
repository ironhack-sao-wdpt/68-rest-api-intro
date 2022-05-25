const { Schema, model, Types } = require("mongoose");

const ProductSchema = new Schema({
  ownerId: { type: Types.ObjectId, ref: "User" },
  name: String,
  description: { type: String, maxlength: 500 },
  inStock: { type: Number, min: 0 },
  price: { type: Number, min: 0 },
  pictureUrl: {
    type: String,
    default:
      "https://media.istockphoto.com/vectors/no-image-available-sign-vector-id922962354?k=20&m=922962354&s=612x612&w=0&h=f-9tPXlFXtz9vg_-WonCXKCdBuPUevOBkp3DQ-i0xqo=",
  },
});

module.exports = model("Product", ProductSchema);
