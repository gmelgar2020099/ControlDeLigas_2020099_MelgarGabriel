const express = require('express');
const usuarioController = require('../controllers/usuarios.controller')
const md_autentificacion = require('../middlewares/aut')

var api = express.Router();

api.post('/login',usuarioController.login)
api.post('/agregarUsuarios', md_autentificacion.Auth,usuarioController.registrarUsuario)
api.put('/editarUsuarios/:id', md_autentificacion.Auth,usuarioController.editarUsuarios)
api.delete('/eliminarUsuarios/:id', md_autentificacion.Auth,usuarioController.eliminarCliente)


// lado usuarios 
api.post('/agregarCliente', md_autentificacion.Auth, usuarioController.agregarClientes)
api.put('/editarCliente/:id', md_autentificacion.Auth, usuarioController.editarCliente)
api.delete('/eliminarU/:id', md_autentificacion.Auth, usuarioController.eliminarU)
module.exports = api;