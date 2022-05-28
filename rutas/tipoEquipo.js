const { Router } = require('express');
const router = Router();
const TipoEquipo = require('../modelos/TipoEquipo');
const { validartipoEquipo } = require('../helpers/validar-tipoEquipo');

router.get('/', async function(req, res){
    try{
        const tipoEquipos = await  TipoEquipo.find();
        res.send(tipoEquipos);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error en el servidor');
    }
});

router.post('/', async function(req, res){

    try{

        const validaciones = validartipoEquipo(req);

        if(validaciones.length > 0){
            return res.status(400).send(validaciones);
        }


        console.log('Objeto de tipo eqipo', req.body);

        const existeTipo = await TipoEquipo.findOne({ nombre: req.body.nombre });

        if(existeTipo){
            res.status(400).send('La marca ingresada ya existe.');
        }

        let tipoEquipo = new TipoEquipo();
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();

        res.send(tipoEquipo);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error')
    }
});

router.put('/:tipoEquipoId', async function(req, res){
    
    try {

        const validaciones = validartipoEquipo(req);

        if(validaciones.length > 0){
            return res.status(400).send(validaciones);
        }

        
        console.log('Objeto recibido',req.body, req.params);
    
        let tipoEquipo = await TipoEquipo.findById( req.params.tipoEquipoId );
    
    
        if(!tipoEquipo){
            return res.status(400).send('Tipo equipo no existe');
        }
    
        const existetipoEquipo = await TipoEquipo.findOne({ nombre: req.body.nombre, _id:{ $ne: tipoEquipo._id } });
    
        console.log('Existe la tipoEquipo', existetipoEquipo);
    
        if(existetipoEquipo){
            return res.status(400).send('tipoEquipo ya existe');
        }
    
        
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaActualizacion = new Date();
    
        tipoEquipo = await tipoEquipo.save();
        
        res.send(tipoEquipo); 
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurio un error.');
    }
});

module.exports = router;