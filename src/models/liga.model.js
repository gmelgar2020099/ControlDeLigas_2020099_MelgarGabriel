const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var ligasSchema = Schema({
    nombreLiga: String,
    idUsuarios: { type: Schema.Types.ObjectId, ref: 'usuarios' }
})

module.exports=mongoose.model('ligas',ligasSchema)