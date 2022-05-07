const Usuarios = require('../models/usuarios.model')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')

function registarAdminDefecto(req, res) {
    var usuarioModelo = new Usuarios();
    usuarioModelo.nombre = 'ADMIN';
    usuarioModelo.rol = 'ROL_ADMINISTRADOR';
    Usuarios.find({ nombre: 'ADMIN' }, (err, usuarioGuardado) => {
        if (usuarioGuardado.length == 0) {
            brycpt.hash("deportes123", null, null, (err, passswordEncypt) => {
                usuarioModelo.password = passswordEncypt
                usuarioModelo.save((err, usuarioGuardadoSegundo) => {
                   console.log( usuarioGuardadoSegundo )
                })
            })
        } else {
            console.log('El usuario ya existe')
        }
    })
}

function login(req, res) {
    var parameters = req.body
    Usuarios.findOne({ nombre: parameters.nombre }, (err, usuarioLogeado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })
        if (usuarioLogeado) {
            bcrypt.compare(parameters.password, usuarioLogeado.password,
                (err, passwordComparacion) => {
                    if (passwordComparacion) {
                        if (parameters.obtenerToken === 'true') {
                            return res.status(200).send({ token: jwt.crearToken(usuarioLogeado) })
                        } else {
                            usuarioLogeado.password = undefined;
                            return res.status(200).send({ usuario: usuarioLogeado })
                        }
                    } else {
                        return res.status(500).send({ message: "contrasena no coincide" });
                    }
                })
        } else {
            return res.status(500).send({ message: "Error, datos erroneos" });
        }
    })
}
function registrarUsuario(req, res) {
    var parameters = req.body;
    var usuariosModel = new Usuarios();
    var verificacion = req.user.rol
    if (verificacion == 'ROL_ADMINISTRADOR') {
        if (parameters.nombre, parameters.password, parameters.rol) {
            usuariosModel.nombre = parameters.nombre;
            usuariosModel.password = parameters.password;
            usuariosModel.rol = parameters.rol;
            Usuarios.find({ nombre: parameters.nombre }, (err, clienteGuardado) => {
                if (clienteGuardado.length == 0) {
                    bcrypt.hash(parameters.password, null, null, (err, passwordEncriptada) => {
                        usuariosModel.password = passwordEncriptada;
                        usuariosModel.save((err, clienteGuardado) => {
                            if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
                            if (!clienteGuardado) return res.status(404).send({ mensaje: 'No se agrego al usuario' });

                            return res.status(201).send({ usuarios: clienteGuardado });
                        })
                    })
                } else {
                    return res.status(500).send({ mensaje: 'No se pueden crear con el mismo nombre' });
                }
            })
        }
    } else {
        return res.status(500).send({ mensaje: 'No tiene permisos para concretar esta solicitud' });
    }
}
function editarUsuarios(req, res) {
    var idUsuario = req.params.id
    var verificacion = req.user.rol
    var parameters = req.body
    if (verificacion == 'ROL_ADMINISTRADOR') {
        Usuarios.findById(idUsuario, (err, usuarioEliminar) => {
            console.log(usuarioEliminar)
            if (usuarioEliminar.rol != "ROL_ADMINISTRADOR") {
                Usuarios.findByIdAndUpdate({ _id: idUsuario }, parameters, { new: true }, (err, UsuarioEliminado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!UsuarioEliminado) return res.status(400).send({ mensaje: 'No es posible editar el usuario' });
                    return res.status(200).send({ usuarios: UsuarioEliminado });
                })
            } else {
                return res.status(500).send({ mensaje: 'Administradores no se pueden editar entre si' });
            }
        })
    }else{
        return res.status(500).send({ mensaje: 'No tiene permisos' });
    }
}
function eliminarCliente(req, res) {
    var idUs = req.params.id
    var parameters = req.body
    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Usuarios.findById(idUs, (err, usuarioCan) => {
            if (usuarioCan.rol != "ROL_ADMINISTRADOR") {
                Usuarios.findByIdAndDelete(
                    {
                        _id: idUs
                    },
                    parameters, (err, eliminate) => {
                        if (err) return res.status(500).send({ mensaje: 'no se ha podido' });
                        if (!eliminate) return res.status(400).send({ mensaje: '' });
                        return res.status(200).send({ usuarios: eliminate });
                    })

            } else {
                return res.status(500).send({ mensaje: 'Administradores no se pueden eliminar entre si' });
            }
        })
    }
}
function agregarClientes(req, res) {
    var parameters = req.body;
    var usuariosModel = new Usuarios();
    var verificacion = req.user.rol
    if (verificacion == 'ROL_CLIENTE') {
        if (parameters.nombre, parameters.password) {
            usuariosModel.nombre = parameters.nombre;
            usuariosModel.password = parameters.password;
            usuariosModel.rol = 'ROL_CLIENTE';
            Usuarios.find({ nombre: parameters.nombre }, (err, clienteGuardado) => {
                if (clienteGuardado.length == 0) {
                    bcrypt.hash(parameters.password, null, null, (err, passwordEncriptada) => {
                        usuariosModel.password = passwordEncriptada;
                        usuariosModel.save((err, clienteGuardado) => {
                            if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
                            if (!clienteGuardado) return res.status(404).send({ mensaje: 'No se agrego al usuario' });
                            return res.status(201).send({ usuarios: clienteGuardado });
                        })
                    })
                } else {
                    return res.status(500).send({ mensaje: 'No se pueden crear con el mismo nombre' });
                }
            })
        }
    } else {
        return res.status(500).send({ mensaje: 'No tiene permisos para concretar esta solicitud' });
    }
}
function editarCliente(req, res) {
    var idUsuario = req.params.id
    var parameters = req.body
    if (idUsuario == req.user.sub) {
        Usuarios.findByIdAndUpdate(req.user.sub, parameters, { new: true }, (err, usuarioNuevo) => {
            if (err) return res.status(500).send({ message: "error en la peticion" });
            if (!usuarioNuevo) return res.status(404).send({ message: "Error, al editar el Usuario" });
            return res.status(200).send({ Usuario: usuarioNuevo });
        })

    } else {
        return res.status(500).send({ message: "id no valido, no puede editar usuarios que no haya creado usted" })
    }
}
function eliminarU(req, res) {
    var idUsuario = req.params.id
    var parameters = req.body
    if (idUsuario == req.user.sub) {
        Usuarios.findByIdAndDelete(req.user.sub, parameters, (err, usuarioNuevo) => {
            if (err) return res.status(500).send({ message: "error en la peticion" });
            if (!usuarioNuevo) return res.status(404).send({ message: "Error, al editar el Usuario" });
            return res.status(200).send({ Usuario: usuarioNuevo });
        })

    } else {
        return res.status(500).send({ message: "id no valido, no puede eliminar usuarios que no haya creado usted" })
    }
}
module.exports = {
    login,
    registarAdminDefecto,
    registrarUsuario,
    editarUsuarios,
    eliminarCliente,
    agregarClientes,
    editarCliente,
    eliminarU
}