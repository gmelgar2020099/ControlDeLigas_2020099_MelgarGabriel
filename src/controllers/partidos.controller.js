const Partidos = require('../models/partidos.model')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Equipos = require('../models/equipos.model')


function asignacionPartidos(req, res) {
    var parameters = req.body
    var productoModel = new Partidos()
    var jornadaMax
    var partidosMaximos
    if (parameters.idEquipo1, parameters.idEquipo2, parameters.golesEquipo1, parameters.golesEquipo2, parameters.jornada) {
        productoModel.idEquipo1 = parameters.idEquipo1;
        productoModel.idEquipo2 = parameters.idEquipo2;
        productoModel.golesEquipo1 = parameters.golesEquipo1;
        productoModel.golesEquipo2 = parameters.golesEquipo2;
        productoModel.jornada = parameters.jornada;
    }
    Partidos.findOne({ idEquipo1: parameters.idEquipo1, jornada: parameters.jornada }, (err, equipo1) => {

        if (err) return res.status(500).send({ mensaje: 'No se realizo la accion equipo1' });
        if (!equipo1) {
            Partidos.findOne({ idEquipo2: parameters.idEquipo2, jornada: parameters.jornada }, (err, equipo2) => {
                if (err) return res.status(500).send({ mensaje: 'No se realizo la accion equipo2' });
                if (!equipo2) {
                    Equipos.find((err, equipoe) => {
                        if (equipoe.lenght % 2 == 0) {
                            //partido y jornada par
                            partidosMaximos = equipoe.length / 2;
                            jornadaMax = (equipoe.length - 1)

                        } else {
                            // partido y jornada impar
                            partidosMaximos = (equipoe.length - 1) / 2
                            jornadaMax = equipoe.length
                        }
                        Partidos.findOne({ jornada: parameters.jornada }, (err, partd) => {
                            if (parameters.jornada <= partidosMaximos) {
                                Partidos.find({ jornada: parameters.jornada }, (err, jornadaB) => {
                                    console.log(equipoe.length)
                                    if (parameters.jornada <= jornadaMax) {
                                        if (err) return res.status(500).send({ mensaje: 'No se realizo la accion jornadaB' });
                                        productoModel.save((err, partidoGuardado) => {
                                            var puntoE1
                                            var puntoE2
                                            var partidosEmpatadosE1
                                            var partidosGanadosE1
                                            var partidosPerdidosE1
                                            var partidosEmpatadosE2
                                            var partidosGanadosE2
                                            var partidosPerdidosE2
                                            if (parameters.golesEquipo1 == parameters.golesEquipo2) {
                                                //equipo 1
                                                puntoE1 = 1
                                                partidosGanadosE1 = 0
                                                partidosEmpatadosE1 = 1
                                                partidosPerdidosE1 = 0
                                                //equipo 2
                                                puntoE2 = 1
                                                partidosGanadosE2 = 0
                                                partidosEmpatadosE2 = 1
                                                partidosPerdidosE2 = 0
                                            } else if (parameters.golesEquipo1 > parameters.golesEquipo2) {
                                                // equipo 1
                                                puntoE1 = 3
                                                partidosGanadosE1 = 1
                                                partidosEmpatadosE1 = 0
                                                partidosPerdidosE1 = 0
                                                // equipo 2
                                                puntoE2 = 0
                                                partidosGanadosE2 = 0
                                                partidosEmpatadosE2 = 0
                                                partidosPerdidosE2 = 1

                                            } else {
                                                //equipo1
                                                puntoE1 = 0
                                                partidosGanadosE1 = 0
                                                partidosEmpatadosE1 = 0
                                                partidosPerdidosE1 = 1
                                                // equipo 2
                                                puntoE2 = 3
                                                partidosGanadosE2 = 1
                                                partidosEmpatadosE2 = 0
                                                partidosPerdidosE2 = 0
                                            }
                                            Equipos.findOneAndUpdate({ _id: parameters.idEquipo1 }, {
                                                $inc: {
                                                    golesAfavor: parameters.golesEquipo1,
                                                    golesEncontra: parameters.golesEquipo2,
                                                    partidosJugados: 1,
                                                    diferenciaGoles: Math.abs(parameters.golesEquipo1 - parameters.golesEquipo2),
                                                    puntos: puntoE1,
                                                    partidosGanados: partidosGanadosE1,
                                                    partidosEmpatados: partidosEmpatadosE1,
                                                    partidosPerdidos: partidosPerdidosE1                                                   
                                                }
                                            }, (err, golesfavor1) => {
                                                if (err) return res.status(500).send({ mensaje: 'No se realizo la accion golesfavor1' });
                                                Equipos.findOneAndUpdate({ _id: parameters.idEquipo2 }, {
                                                    $inc: {
                                                        golesAfavor: parameters.golesEquipo2,
                                                        golesEncontra: parameters.golesEquipo1,
                                                        partidosJugados: 1,
                                                        diferenciaGoles: Math.abs(parameters.golesEquipo2 - parameters.golesEquipo1),
                                                        puntos: puntoE2,
                                                        partidosGanados: partidosGanadosE2,
                                                        partidosEmpatados: partidosEmpatadosE2,
                                                        partidosPerdidos: partidosPerdidosE2
                                                     
                                                    }
                                                }, (err, golesa) => {
                                                    if (err) return res.status(500).send({ mensaje: 'No se realizo la accion golesa' });
                                                })
                                            })
                                            return res.status(200).send({ partido: partidoGuardado });
                                        })
                                    } else {
                                        return res.status(500).send({ mensaje: 'es mayor a las jornadas disponibles' });
                                    }
                                })
                            } else {
                                return res.status(500).send({ mensaje: 'No se puede agregar' });
                            }
                        })

                    })
                } else {
                    return res.status(500).send({ mensaje: 'El equipo 2 ya ha jugado en esta jornada' });
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'El equipo 1 ya ha jugado en esta jornada' });
        }
    })
}


function puntos() {
    
}


module.exports = {
    asignacionPartidos

}