const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var equiposSchema = Schema({
    nombreEquipo: String,
    golesAfavor: Number,
    golesEncontra: Number,
    diferenciaGoles: Number,
    partidosJugados:Number,
    partidosGanados: Number, 
    partidosPerdidos :Number, 
    partidosEmpatados:Number,
    puntos:Number,
    idUsuarios: { type: Schema.Types.ObjectId, ref: 'usuarios' },
    idLigas: { type: Schema.Types.ObjectId, ref: 'ligas' },


})

module.exports = mongoose.model('equipos', equiposSchema)