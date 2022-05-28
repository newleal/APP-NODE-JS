const { Router } = require('express');
const { send } = require('express/lib/response');
const Inventario = require('../modelos/Inventario');
const { validarInventario } = require('../helpers/validar-inventario');

const router = Router();

//http://localhost:3000/inventario
// GET http://localhost:3000/inventario listar todos
// POST http://localhost:3000/inventario crear
// PUT http://localhost:3000/inventario editar

router.get('/', async function(req, res) {
    // req.params.usuario
    //req.body
    //console.log(req.params);
    try{

        

        const inventarios = await  Inventario.find().populate([
            {
                path:'usuario',select: 'nombre email estado'
            },{
                path:'marca', select: 'nombre estado'
            },{
                path:'tipoEquipo', select: 'nombre estado'
            },{
                path:'estadoEquipo', select: 'nombre estado'
            }
        ]);
        res.send(inventarios);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error en el servidor');
    }
});

router.post('/', async function(req,res) {
    //console.log(req.body);
    try{

        const validaciones = validarInventario(req);

        if(validaciones.length > 0){
            return res.status(400).send(validaciones);
        }

        const { serial, modelo,descripcion,foto,precio, usuario,marca,
             tipoEquipo, estadoEquipo, fechaCompra } = req.body;

        const existeInventario = await Inventario.findOne({ serial: serial });
        if(existeInventario){
            return res.status(400).send('El serial ya existe');
        }

        const fechaActual = new Date();

        let inventario = new Inventario();

        inventario.serial = serial;
        inventario.modelo = modelo;
        inventario.descripcion = descripcion;
        inventario.foto = foto;
        inventario.precio = precio;
        inventario.usuario = usuario._id;
        inventario.marca = marca._id;
        inventario.tipoEquipo = tipoEquipo._id;
        inventario.estadoEquipo = estadoEquipo._id;
        inventario.fechaCompra= fechaCompra;
        // Datos transaccionales
        inventario.fechaCreacion = fechaActual;
        inventario.fechaActualizacion = fechaActual;

        inventario = await inventario.save();
        res.send(inventario);


    }catch(error){
        console.log(error);
        res.status(500),send('Error en el servidor');
    }
});

router.put('/:inventarioId', async function(req, res) {
    //console.log(req.body);
    try{

        const validaciones = validarInventario(req);

        if(validaciones.length > 0){
            return res.status(400).send(validaciones);
        }
        
        let inventario = await Inventario.findById(req.params.inventarioId);
        
        // Si no exixte inventario , entonces no alcutalizo
        if(!inventario){
            return res.status(400).send('No exixte el inventario');
        }

        const { serial, modelo,descripcion,foto,precio, usuario,marca,
             tipoEquipo, estadoEquipo, fechaCompra } = req.body;

            // buscame por serial pero distinto al inventario que estoy actualizando 
            const inventarioExisteSerial = await Inventario.findOne({ serial: serial, _id: { $ne: inventario._id } });
            if(inventarioExisteSerial){
                return res.status(400).send('El serial ya existe');
            }

            const fechaActual = new Date();

     
            inventario.serial = serial;
            inventario.modelo = modelo;
            inventario.descripcion = descripcion;
            inventario.foto = foto;
            inventario.precio = precio;
            inventario.usuario = usuario._id;
            inventario.marca = marca._id;
            inventario.tipoEquipo = tipoEquipo._id;
            inventario.estadoEquipo = estadoEquipo._id;
            inventario.fechaCompra= fechaCompra;
            // Datos transaccionales
            inventario.fechaActualizacion = fechaActual;
            inventario = await inventario.save();
            res.send(inventario);


    }catch(error){
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;