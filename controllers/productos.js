const { response, request } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate("usuario", "nombre")
            .populate("categoria", "nombre"),
  ]);

  return res.json({
    total,
    productos,
  });
};

const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  return res.json(producto);
};

const crearProducto = async (req = request, res = response) => {
  const { estado, usuario, ...producto } = req.body;
  producto.nombre = producto.nombre.toUpperCase();
  producto.usuario = req.usuario._id;

  try {
    const productoDB = await Producto.findOne({ nombre: producto.nombre });
    if (productoDB) {
      return res.status(400).json({
        msg: `El producto ${productoDB.nombre}, ya existe`,
      });
    }

    //* Otra forma de hacerlo
    const data = {
        ...producto,
        nombre: producto.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    //! Generar la data a guardar
    const newProducto = await new Producto(producto);
    await newProducto.save();

    return res.status(201).json(newProducto);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Revisar logs del servidor",
    });
  }
};

const actualizarProducto = async (req = request, res = response) => {
  const id = req.params.id;

  const { estado, usuario, ...data } = req.body;

  if( data.nombre ){
      data.nombre = data.nombre.toUpperCase();
  }
  
  data.usuario = req.usuario._id;
  
  try {
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    return res.status(201).json(producto);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Revisar logs del servidor",
    });
  }
};

const borrarProducto = async (req = request, res = response) => {
  const id = req.params.id;
  const producto = await Producto.findByIdAndUpdate(id, { estado: false },{ new: true });
  return res.json(producto);
};
module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};
