const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");

const {
  existeCategoriaPorId,
  existeProductoPorId,
} = require("../helpers/db-validators");

const router = Router();

// Obtener todos los productos - public
router.get("/", obtenerProductos);

// Obtener un producto por id - public
router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

// Crear producto - Privado - cualquier persona con un token válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("precio", "El precio es obligatorio").not().isEmpty().isNumeric(),
    check("categoria", "La categoria no es un ID valido").isMongoId(),
    check("categoria").custom((categoria) => existeCategoriaPorId(categoria)),
    check("descripcion", "La descripcion es obligatoria").notEmpty(),
    check("disponible", "La disponibilidad es obligatoria").notEmpty(),
    validarCampos,
  ],
  crearProducto
);

// Actualizar producto - Privado - cualquier persona con un token válido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "El ID no es valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("precio", "El precio es obligatorio").not().isEmpty().isNumeric(),
    check("categoria", "La categoria no es un ID valido").isMongoId(),
    check("categoria").custom((categoria) => existeCategoriaPorId(categoria)),
    check("descripcion", "La descripcion es obligatoria").notEmpty(),
    check("disponible", "La disponibilidad es obligatoria").notEmpty(),
    validarCampos,
  ],
  actualizarProducto
);

// Borrar una producto - Admin (Marcar estado true/false)
router.delete("/:id", [
    validarJWT,
    esAdminRole,
    check('id', 'El Id no es valido').isMongoId(),
    check('id').custom( existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;
