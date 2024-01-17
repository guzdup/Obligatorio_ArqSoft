const sequalize = require('./sequelize.js');

async function connectDBsql(){
    try{
        await sequalize.sync();
    }catch(error){
        console.log("Error al conectar con la base de datos ", error);
    }
}

module.exports = connectDBsql;