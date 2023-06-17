const Role = require("../models/role");
const { Usuario, Categoria, Producto } = require("../models");

const isRoleValid = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};

const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });

  if (existeEmail) {
    throw new Error(`El correo ${correo} ya está registrado`);
  }
};

const existeUsuarioPorId = async (id = "") => {
  const existeUsuario = await Usuario.findById(id);

  if (!existeUsuario) {
    throw new Error(`El id no existe, ${id} `);
  }
};

/**
 * Validadores de categorias
 */
const existeCategoriaPorId = async (id = "") => {
  const categoria = await Categoria.findById(id);

  if (!categoria) {
    throw new Error(`La categoria con id ${id} no existe`);
  }
};

/**
 * Validadores de Productos
 */
const existeProductoPorId = async (id = "") => {
  const producto = await Producto.findById(id);

  if (!producto) {
    throw new Error(`El producto con id ${id} no existe`);
  }
};
/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{
  const incluida = colecciones.includes( coleccion );

  if( !incluida ){
    throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
  }
  return true;
}

module.exports = {
  isRoleValid,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
  coleccionesPermitidas,
};
