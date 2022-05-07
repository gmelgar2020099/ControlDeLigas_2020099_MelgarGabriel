
var express = require('express');
const cors = require('cors');
var app = express();

//IMPORTACIONES RUTAS
const rutasUsuario = require('./src/routes/usuarios.routes');
const rutasLigas = require('./src/routes/ligas.routes');
const rutasEquipos= require('./src/routes/equipos.routes')
const rutasPartidos= require('./src/routes/partidos.routes')

//MIDDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//CABECERAS
app.use(cors());

//CARGA DE RUTAS se realizaba como localhost:3000/obtenerProductos
app.use('/api', rutasUsuario, rutasLigas, rutasEquipos, rutasPartidos);


module.exports = app;