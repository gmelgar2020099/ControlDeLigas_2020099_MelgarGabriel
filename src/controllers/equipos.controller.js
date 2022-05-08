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
            if (!equipoNuevo) {
                return res.status(404).send({ mensaje: 'no se encuentran equipos' })
            }
            Equipos.find({ idLigas: parameters.idLigas }, (err, equipo1) => {
                if (!equipo1) {
                    return res.status(404).send({ mensaje: 'no se encuentran ligas con esos equipos' })
                }
                if (equipo1.length >= 10) {
                    return res.status(500).send({ message: "La liga solo admite 10 equipos " });
                } else {
                    if (equipoNuevo.length == 0) {
                        equiposModel.save((err, equipo) => {
                            if (err) return res.status(500).send({ message: 'Error en la peticion' });
                            if (!equipo) {
                                return res.status(404).send({ message: 'error, al agregar el empleado' });
                            }
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
function buscarEquipoLiga(req, res) {
    var idLigas = req.params.idLigas;
    if (req.user.rol == "ROL_CLIENTE") {
        Ligas.findOne({ idLigas: { $regex: idLigas, $options: ['i', 'x'] } }, (err, ligae) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!ligae) return res.status(404).send({ mensaje: "Error, no se encuentran categorias con ese id" });
            Equipos.find({ idLigas: ligae._id, idUsuarios: req.user.sub }, (err, equipoEcontrado) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!equipoEcontrado) return res.status(404).send({ mensaje: "Error, no se encuentran productos en dicha categoria" });
                return res.status(200).send({ torneos: equipoEcontrado });
            })
        })
    } else {
        return res.status(500).send({ mensaje: 'No posee permisos para completar la peticion' });
    }
}
function generarReporte(req, res) {
    var idLigas = req.params.idLigas;
    if (req.user.rol == "ROL_CLIENTE") {
        Ligas.findOne({ idLigas: { $regex: idLigas, $options: ['i', 'x'] } }, (err, ligae) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            Equipos.find({ idLigas: ligae._id, idUsuarios: req.user.sub }, (err, equipoEcontrado) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                console.log(equipoEcontrado)
                return res.status(200).send({ torneos: equipoEcontrado });
            }).populate('idLigas')
        })
    } else {
        return res.status(500).send({ mensaje: 'No posee permisos para completar la peticion' });
    }
}
function tablaLiga(req, res) {
    var idLigas = req.params.idLigas;
    if (req.user.rol == "ROL_CLIENTE") {
        Ligas.findOne({ idLigas: { $regex: idLigas, $options: ['i', 'x'] } }, (err, ligae) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!ligae) return res.status(404).send({ mensaje: "Error, no se encuentran categorias con ese id" });
            Equipos.find({ idLigas: ligae._id, idUsuarios: req.user.sub }, (err, equipoEcontrado) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                generarPdf(equipoEcontrado)
                return res.status(200).send({ equipos: equipoEcontrado });
            }).sort({ puntos: -1 })
        })

    } else {
        return res.status(500).send({ mensaje: 'No posee permisos para completar la peticion' });
    }
}


function generarPdf(cantidadDeEquipos) {
    const fs = require('fs');
    const Pdfmake = require('pdfmake');
    var fonts = {
        Roboto: {
            normal: './fonts/roboto/Roboto-Regular.ttf',
            bold: './fonts/roboto/Roboto-Medium.ttf',
            italics: './fonts/roboto/Roboto-Italic.ttf',
            bolditalics: './fonts/roboto/Roboto-MediumItalic.ttf'
        }
    };
    let pdfmake = new Pdfmake(fonts);
    let content = [{
        text: 'Reporte de la liga',
        alignment: 'center',
        fontSize: 35,
        color: '#000000',
        bold: true,
        margin: [0, 0, 0, 60]
    }]

    var titulos = new Array(
        'Posición',
        'Nombre',
        'Puntos',
        'GA',
        'GE',
        'DG',
        'PJ',
        'PG',
        'PP',
        'PE'
    );

    var body = []
    body.push(titulos)
    for (let i = 0; i < cantidadDeEquipos.length; i++) {
        var datosEquipos = new Array((i + 1),
            cantidadDeEquipos[i].nombreEquipo,
            cantidadDeEquipos[i].puntos,
            cantidadDeEquipos[i].golesAfavor,
            cantidadDeEquipos[i].golesEncontra,
            cantidadDeEquipos[i].diferenciaGoles,
            cantidadDeEquipos[i].partidosJugados,
            cantidadDeEquipos[i].partidosGanados,
            cantidadDeEquipos[i].partidosPerdidos,
            cantidadDeEquipos[i].partidosEmpatados
        )
        body.push(datosEquipos)
    }
    content.push({
        text: ' ',
        margin: [0, 0, 0, 0]
    })
    content.push({
        table: {
            heights: 20,
            headerRows: 1,
            widths:'auto',
            body: body
        },
        margin: [0, 0, 0, 0]
    })
    let docDefinition = {
        content: content,
        background: function () {
            return {
                canvas: [
                    {
                        type: 'rect',
                        x: 0,
                        y: 0,
                        w: 20,
                        h: 100,
                        color: '#2BA466'
                    },
                    {
                        type: 'rect',
                        x: 579,
                        y: 780,
                        w: 20,
                        h: 51,
                        color: '#6149D6'
                    },
                    {
                        type: 'rect',
                        x: 400,
                        y: 831,
                        w: 300,
                        h: 10,
                        color: '#6149D6'
                    },
                    {
                        type: 'rect',
                        x: 9,
                        y: 0,
                        w: 300,
                        h: 10,
                        color: '#2BA466'
                    }
                ]

            }
        }
    }
    let pdfDoc = pdfmake.createPdfKitDocument(docDefinition, {});
    pdfDoc.pipe(fs.createWriteStream("./src/pdfGenerate/reporteLigas.pdf"));
    pdfDoc.end();
}

module.exports = {
    asignacionEquipoLiga,
    editarEquipo,
    eliminarEquipo,
    tablaLiga,
    generarReporte,
    generarPdf,
    buscarEquipoLiga
}


