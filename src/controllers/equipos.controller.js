const Equipos = require('../models/equipos.model')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Ligas = require('../models/liga.model')


function asignacionEquipoLiga(req, res) {
    var parameters = req.body
    var equiposModel = new Equipos()
    if (parameters.nombreEquipo && parameters.idLigas && parameters.idUsuarios) {
        equiposModel.nombreEquipo = parameters.nombreEquipo
        equiposModel.golesAfavor = 0
        equiposModel.golesEncontra = 0
        equiposModel.diferenciaGoles = 0
        equiposModel.partidosJugados = 0
        equiposModel.partidosGanados = 0
        equiposModel.partidosPerdidos = 0
        equiposModel.partidosEmpatados = 0
        equiposModel.puntos = 0
        equiposModel.idLigas = parameters.idLigas
        equiposModel.idUsuarios = parameters.idUsuarios
    }
    if (req.user.rol == 'ROL_CLIENTE') {
        Equipos.find({ nombreEquipo: parameters.nombreEquipo }, (err, equipoNuevo) => {
            Equipos.find({ idLigas: parameters.idLigas }, (err, equipo1) => {

                if (equipo1.length >= 10) {
                    return res.status(500).send({ message: "La liga solo admite 10 equipos " });
                } else {
                    if (equipoNuevo.length == 0) {
                        equiposModel.save((err, equipo) => {
                            if (err) return res.status(500).send({ message: 'Error en la peticion' });
                            if (!equipo) return res.status(404).send({ message: 'error, al agregar el empleado' });
                            return res.status(200).send({ equipos: equipo });
                        })
                    } else {
                        return res.status(404).send({ message: 'esta creando el  mismo equipo' })
                    }
                }
            })
        })
    } else {
        return res.status(500).send({ message: 'Error, no tiene permisos' });
    }
}


function editarEquipo(req, res) {
    var idEquipo = req.params.id
    var parameters = req.body
    if (req.user.rol == 'ROL_CLIENTE') {
        Equipos.findOneAndUpdate({ _id: idEquipo, idUsuarios: req.user.sub }, parameters, { new: true }, (err, equipoEditado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            console.log(equipoEditado)
            if (!equipoEditado) return res.status(404).send({ message: 'error, al editar el equipo' });
            return res.status(200).send({ equipos: equipoEditado });
        })
    }
}
function eliminarEquipo(req, res) {
    var idEquipo = req.params.id
    var parameters = req.body
    Equipos.findOneAndDelete({ _id: idEquipo, idUsuarios: req.user.sub }, parameters, (err, equipoEliminado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!equipoEliminado) return res.status(404).send({ message: 'error, al eliminar el equipo' });
        return res.status(200).send({ Ligas: equipoEliminado });
    })
}
function buscarEquipoIdLiga(req, res) {
    var idLigas = req.params.idLigas;
    if (req.user.rol == "ROL_CLIENTE") {
        Ligas.findOne({ idLigas: { $regex: idLigas, $options:['i','x'] } }, (err, ligae) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!ligae) return res.status(404).send({ mensaje: "Error, no se encuentran categorias con ese id" });
            Equipos.find({ idLigas: ligae._id, idUsuarios: req.user.sub }, (err, equipoEcontrado) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!equipoEcontrado) return res.status(404).send({ mensaje: "Error, no se encuentran productos en dicha categoria" });
                return res.status(200).send({ torneos: equipoEcontrado });
            }).populate('idLigas')
        })
    } else {
        return res.status(500).send({ mensaje: 'No posee permisos para completar la peticion' });
    }
}

module.exports = {
    asignacionEquipoLiga,
    editarEquipo,
    eliminarEquipo,
    buscarEquipoIdLiga
}


