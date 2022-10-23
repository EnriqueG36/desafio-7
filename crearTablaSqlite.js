//Este script solo contiene la sintaxys par crear la tabla en sqlite que requiere el desafío

const dbConfig = require('./db/config.js');     //importamos el archivo de configuracion para Knex
const knex = require('knex')(dbConfig.sqlite);  //Importamos knex y le configuramos para usar sqlite

//Crea la tabla tablaChat en la base de datos sqlite
(async () => {
    await knex.schema.createTable('tablaChat', (table) => {
        table.increments('id');
        table.string('author').notNullable();
        table.string('messageDate');
        table.string('text');
    });
    console.log("Tabla creada");
}
);

