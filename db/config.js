//Contiene el objeto de configuración de Knex

module.exports = {
    mariaDB: {
        client: 'mysql',
        connection: {
            host: '',
            port: ,
            user: '',
            password: '',
            database: 'desafio7',
        }
    },
    sqlite: {
        client: 'sqlite3',
        connection: {
            filename: '../db/sqlite/historialchat.sqlite'
        }
    }
}