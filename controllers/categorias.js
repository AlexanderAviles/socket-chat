const { response, request } = require("express");
const { Categoria } = require("../models");

// obtenercategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query).skip(Number(desde)).limit(Number(limite)).populate('usuario', 'nombre'),
  ]);

  return res.json({
    total,
    categorias,
  });
};

// obtenercategoria - populate {}
const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

  return res.json(categoria);
};

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`,
    });
  }

  //! Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = await new Categoria(data);

  // Guardar en base de datos
  await categoria.save();

  res.status(201).json(categoria);
};

// actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
  const id = req.params.id;
  
  //! Se sacan todos los posibles valores que no se quieren modificar para evitar que el usuario
  //! intente actualizarlos

  const {estado, usuario, ...data} = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  try {
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true }); //* (new: true) regresa el nuevo objeto actualizado
    
    return res.status(201).json(categoria);

  } catch (error) {

    console.log(error);
    return res.status(500).json({
      msg: "Revisar logs del servidor",
    });

  }
};

// borrarCategoria - estado: false
const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
  return res.json(categoria);
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
