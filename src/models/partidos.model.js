const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var partidosSchema = Schema({
    idEquipo1: { type: Schema.Types.ObjectId, ref: 'equipos' },
    idEquipo2: { type: Schema.Types.ObjectId, ref: 'equipos' },
    golesEquipo1: Number,
    golesEquipo2: Number,
    jornada: Number
})

module.exports=mongoose.model('partidos',partidosSchema)