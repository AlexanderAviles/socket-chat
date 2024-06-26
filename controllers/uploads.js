const path = require("path");
const fs = require("fs");
const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");
const cloudinary = require("cloudinary").v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async (req = request, res = response) => {
  try {
    // const nombre = await subirArchivo(req.files, ['jpg','md'], 'textos');
    const nombre = await subirArchivo(req.files, undefined, "imgs");

    res.json({
      nombre,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const actualizarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          mgs: "No existe usuario con ese id",
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          mgs: "No existe producto con ese id",
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //! Limpiar imagenes previas
  try {
    if (modelo.img) {
      //! Hay que borrar la imagen del servidor
      const pathImagen = path.join(
        __dirname,
        "../uploads",
        coleccion,
        modelo.img
      );
      if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();
  res.json(modelo);
};

const actualizarImagenCloudinary = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          mgs: "No existe usuario con ese id",
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          mgs: "No existe producto con ese id",
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //! Limpiar imagenes previas
  try {
    if (modelo.img) {
      const nombreArr = modelo.img.split('/');
      const nombre = nombreArr[ nombreArr.length - 1];
      const [ public_id ] = nombre.split('.')
      cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
    await modelo.save();
  } catch (error) {
    return res.status(500).json(error);
  }
  return res.json(modelo);
};

const mostrarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          mgs: "No existe usuario con ese id",
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          mgs: "No existe producto con ese id",
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //! Limpiar imagenes previas
  try {
    if (modelo.img) {
      //! Hay que borrar la imagen del servidor
      const pathImagen = path.join(
        __dirname,
        "../uploads",
        coleccion,
        modelo.img
      );
      if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }

  const pathImagenNotFound = path.join(__dirname, "../assets/no-image.jpg");
  return res.sendFile(pathImagenNotFound);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};
