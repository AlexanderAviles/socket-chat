const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const query = { estado: true };


  //* Ejecuta todas las promesas simultaneamente
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);
  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //! Encriptar contrasella
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  try {
    //* Guardar en BD
    await usuario.save();

    res.status(400).json({
      msg: "post API",
      usuario,
    });
  } catch (error) {
    console.log(error);
  }
};

const usuariosPut = async (req, res) => {
  const id = req.params.id;

  const { _id, password, google, correo, ...resto } = req.body;

  //Todo: Validar contra base de datos

  if (password) {
    //! Encriptar contrasella
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }
  try {
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.status(201).json(usuario);
  } catch (error) {
    console.log(error);
  }
};

const usuariosDelete = async (req, res) => {
  const { id } = req.params;

  //! Borrar fisicamente
  // const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate( id, {estado: false})

  
  res.json( usuario );
};

const usuariosPatch = (req, res) => {
  
  res.json({
    msg: "patch API",
  });
};


module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
