const express = require('express');
const ligacontroller = require('../controllers/ligas.controller')
const md_autentificacion = require('../middlewares/aut')


var api = express.Router();


api.post('/agregarLiga', ligacontroller.agregarLiga)
api.put('/editarLiga/:id',md_autentificacion.Auth, ligacontroller.editarLiga)
api.delete('/eliminarLiga/:id',md_autentificacion.Auth, ligacontroller.eliminarLiga)
module.exports = api;