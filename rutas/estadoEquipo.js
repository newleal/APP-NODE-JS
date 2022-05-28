const { Router } = require('express');
const router = Router();
const EstadoEquipo = require('../modelos/EstadoEquipo');
const { validarEstadoEquipo } = require('../helpers/validar-estadoEquipos');

router.post('/', async function(req, res){

    try{

        const validaciones = validarEstadoEquipo(req);

        if(validaciones.length > 0){
            return res.status(400).send(validaciones);
        }


        console.log('Objeto recibodo desde estado equipo',req.body);
        const existeEstado = await EstadoEquipo.findOne({ nombre: req.body.nombre });

        if(existeEstado){
            res.status(400).send('El nombre de estado de equipo ya exixte.')
        }

        let estadoEquipo = new EstadoEquipo();
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();

        res.send(estadoEquipo);
    
    } catch(error){

        console.log(error);
        res.send('Ocurrio un error');
    }
    
});

router.get('/', async function(req, res){
    try{
        const estadoEquipos = await  EstadoEquipo.find();
        res.send(estadoEquipos);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error en el servidor');
    }
});

router.put('/:estadoEquipoId', async function(req, res){
    try {

        const validaciones = validarEstadoEquipo(req);

        if(validaciones.length > 0){
            return res.status(400).send(validaciones);
        }

        
        console.log('Objeto recibido',req.body, req.params);
    
        let estadoEquipo = await EstadoEquipo.findById( req.params.estadoEquipoId );
    
    
        if(!estadoEquipo){
            return res.status(400).send('estadoEquipo no existe');
        }
    
        const existeestadoEquipo = await EstadoEquipo.findOne({ nombre: req.body.nombre, _id:{ $ne: estadoEquipo._id } });
    
        console.log('Existe la estadoEquipo', existeestadoEquipo);
    
        if(existeestadoEquipo){
            return res.status(400).send('estadoEquipo ya existe');
        }
    
        
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaActualizacion = new Date();
    
        estadoEquipo = await estadoEquipo.save();
        
        res.send(estadoEquipo); 
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurio un error.');
    }
});

module.exports = router;