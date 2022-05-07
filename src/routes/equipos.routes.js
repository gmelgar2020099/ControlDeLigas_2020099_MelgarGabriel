const express = require('express');
const equipoController = require('../controllers/equipos.controller')
const md_autentificacion = require('../middlewares/aut')


var api = express.Router();


api.post('/agregarEquipo', md_autentificacion.Auth, equipoController.asignacionEquipoLiga)
api.put('/editarEquipo/:id', md_autentificacion.Auth, equipoController.editarEquipo)
api.delete('/eliminarEquipo/:id', md_autentificacion.Auth, equipoController.eliminarEquipo)

api.get('/buscarEquipoLiga/:idLigas',md_autentificacion.Auth,equipoController.buscarEquipoIdLiga);
module.exports = api;