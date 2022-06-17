const express = require('express');

const { getConnection } = require('./db/db-connection-mongo');

const cors = require('cors')

// crear las tablas cuadno se levante la aplicacion
const Marca = require('./modelos/Marca');
const Inventario = require('./modelos/Inventario');
const EstadoEquipo = require('./modelos/EstadoEquipo');
const TipoEquipo = require('./modelos/TipoEquipo');
const Usuario = require('./modelos/Usuario');

const app = express();
const port = 4000;
app.use(cors());

getConnection();

// Parseo Json midellware
app.use(express.json());

// las rutas que se van a utilizar
app.use('/usuario', require('./rutas/usuario'));
app.use('/estado-equipo', require('./rutas/estadoEquipo'));
app.use('/marca', require('./rutas/marca'));
app.use('/tipo-Equipo', require('./rutas/tipoEquipo'));
app.use('/inventario', require('./rutas/inventarios'));
//const inventario = require('./rutas/inventarios');




app.listen(port, function() {
    console.log(`Aplicacion corriendo en el puerto ${port}`);
});