const mongoose = require('mongoose');

const getConnection = async() => {
    try{
        console.log('Inicializando llamado a la base de datos...');
        await mongoose.connect('mongodb://admin:1234@cluster0-shard-00-00.sgwip.mongodb.net:27017,cluster0-shard-00-01.sgwip.mongodb.net:27017,cluster0-shard-00-02.sgwip.mongodb.net:27017/inventarios-api?ssl=true&replicaSet=atlas-gr135m-shard-0&authSource=admin&retryWrites=true&w=majority');
        console.log('Estoy conectado!!!');
    }catch(error){
        console.log('Fallo la conexion a la base de datos');
    }
}

module.exports = {
    getConnection,
}