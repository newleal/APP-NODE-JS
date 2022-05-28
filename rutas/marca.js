const { Router } = require('express');
const router = Router();
const Marca = require('../modelos/Marca');
const { validarMarca } = require('../helpers/validar-marca');

router.get('/', async function(req, res){
    try{
        const marcas = await  Marca.find();
        res.send(marcas);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error en el servidor');
    }
});

router.post('/', async function(req, res){

    try{

        const validaciones = validarMarca(req);

        if(validaciones.length > 0){
            return res.status(400).send(validaciones);
        }


        console.log('Datos desde Marca', req.body);

        const existeMarca = await Marca.findOne({ nombre: req.body.nombre });

        if(existeMarca){
            res.status(400).send('La marca a ingresar ya exixte.');
        }

        let marca = new Marca();
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();

        marca = await marca.save();
        
        res.send(marca);

    } catch(error){

        console.log(error);
        res.send('Ocurrio un error');
    }
});

router.put('/:marcaId', async function(req, res){
    try {

        const validaciones = validarMarca(req);

        if(validaciones.length > 0){
            return res.status(400).send(validaciones);
        }

        
        console.log('Objeto recibido',req.body, req.params);
    
        let marca = await Marca.findById( req.params.marcaId );
    
    
        if(!marca){
            return res.status(400).send('Marca no existe');
        }
    
        const existeMarca = await Marca.findOne({ nombre: req.body.nombre, _id:{ $ne: marca._id } });
    
        console.log('Existe la marca', existeMarca);
    
        if(existeMarca){
            return res.status(400).send('Marca ya existe');
        }
    
        
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaActualizacion = new Date();
    
        marca = await marca.save();
        
        res.send(marca); 
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurio un error.');
    }
});

module.exports = router;