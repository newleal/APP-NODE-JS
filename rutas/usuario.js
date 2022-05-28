const { Router } = require('express');
const router = Router();
const Usuario = require('../modelos/Usuario');
const { validarUsuario } = require('../helpers/validar-usuario');

router.post('/', async function(req, res) {


   try {

    const validaciones = validarUsuario(req);

    if(validaciones.length > 0){
        return res.status(400).send(validaciones);
    }



    console.log('Objeto recibido',req.body);

    const existeUsuario = await Usuario.findOne({ email: req.body.email });


    if(existeUsuario){
        return res.status(400).send('email ya exixte');
    }

    let usuario = new Usuario();
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    usuario.estado = req.body.estado;
    usuario.fechaCreacion = new Date();
    usuario.fechaActualizacion = new Date();
 
    usuario = await usuario.save();
    
    res.send(usuario); 

   } catch (error) {
       console.log(error);
       res.status(500).send('Ocurio un error.');
   }
   
});


router.get('/', async function(req, res) {
    try{
        const usuarios = await  Usuario.find();
        res.send(usuarios);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error en el servidor');
    }
});

router.put('/:usuarioId', async function(req, res) {

    try {

        const validaciones = validarUsuario(req);

        if(validaciones.length > 0){
            return res.status(400).send(validaciones);
        }
    
            
        console.log('Objeto recibido',req.body, req.params);

        let usuario = await Usuario.findById( req.params.usuarioId );


        if(!usuario){
            return res.status(400).send('Usuario no existe');
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email, _id:{ $ne: usuario._id } });

        console.log('Existe el usuario usuario.js', existeUsuario);

        if(existeUsuario){
            return res.status(400).send('Email ya existe');
        }

        
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();
        
        res.send(usuario); 

} catch (error) {
    console.log(error);
    res.status(500).send('Ocurio un error.');
}
});

module.exports = router;