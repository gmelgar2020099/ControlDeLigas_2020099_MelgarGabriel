const Ligas = require('../models/liga.model')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Usuarios = require('../models/usuarios.model')


function agregarLiga(req, res) {
    var parameters = req.body
    var productoModel = new Ligas()
    if (parameters.nombreLiga && parameters.idUsuarios) {
        productoModel.nombreLiga = parameters.nombreLiga
        productoModel.idUsuarios = parameters.idUsuarios
    }

    Ligas.find({ nombreLiga: parameters.nombreLiga }, (err, productoAgregado) => {
        if (productoAgregado.length == 0) {
            productoModel.save((err, liga) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                if (!liga) return res.status(404).send({ message: 'error, al agregar el empleado' });
                return res.status(200).send({ ligas: liga });
            })
        } else {
            return res.status(404).send({ message: 'esta creandoo la misma liga' })
        }
    })
}

function editarLiga(req, res) {
    var idLiga = req.params.id
    var parameters = req.body
    Ligas.findOneAndUpdate({ _id: idLiga, idUsuarios: req.user.sub }, parameters, { new: true }, (err, ligaEditada) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!ligaEditada) return res.status(404).send({ message: 'error, al editar el Producto' });
        return res.status(200).send({ Ligas: ligaEditada });
    })
}
function eliminarLiga(req, res) {
    var idLiga = req.params.id
    var parameters = req.body
    Ligas.findOneAndDelete({ _id: idLiga, idUsuarios: req.user.sub }, parameters, (err, ligaeliminada) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!ligaeliminada) return res.status(404).send({ message: 'error, al eliminar el Producto' });
        return res.status(200).send({ Ligas: ligaeliminada });
    })
}


module.exports = {
    agregarLiga,
    editarLiga,
    eliminarLiga
}