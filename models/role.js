const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});

RoleSchema.methods.toJSON = function(){
    const { _id, ...roles } = this.toObject();
    return roles;
}

module.exports = model( 'Role', RoleSchema )