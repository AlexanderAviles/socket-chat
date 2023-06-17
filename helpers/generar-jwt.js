const jwt = require('jsonwebtoken')
const {Usuario} = require('../models');

const generarJWT = ( uid = '' ) => {
    return new Promise((resolve, reject) => {
        
        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPIRVATEKEY, {
            expiresIn: '9h'
        }, ( err, token ) => {
            
            if( err ){
                console.log(err);
                reject('No se pudo generar el token')
            }else{
                resolve(token);
            }
        })


    });
}

const comprobarJWT = async (token = '') => {
    try {
        if (token.length < 10){
            return null
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPIRVATEKEY)

        const usuario = await Usuario.findById(uid);

        if( usuario ){
            if(usuario.estado){
                return usuario;
            }
            return null
        }else{
            return usuario;
        }

    } catch (error) {
        return null;
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}