const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// 1. Autenticar na API do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Criar uma instância do multer-storage-cloudinary (na terminologia do Express, chamamos isso de storage) configurando como os arquivos vão ser enviados e armazenados no servidor de arquivos

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "rest-intro",
    format: async (req, file) => "jpg",
    use_filename: true,
  },
});

module.exports = multer({ storage });
