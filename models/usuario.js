const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
    },
    correo: {
      type: String,
      required: [true, "El corre es obligatorio"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatorio"],
      unique: true,
    },
    img: {
      type: String,
    },
    rol: {
      type: String,
      required: true,
    },
    estado: {
      type: Boolean,
      default: true,
    },
    google: {
      type: Boolean,
      default: false,
    },
  });

  UsuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
  };

  module.exports = model("Usuario", UsuarioSchema);