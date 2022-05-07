const express = require('express');
const partidosController = require('../controllers/partidos.controller')
const md_autentificacion = require('../middlewares/aut')


var api = express.Router();

api.post('/asignacionPartidos', partidosController.asignacionPartidos)

module.exports = api;