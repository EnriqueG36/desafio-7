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
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: './db/sqlite/historialChat.sqlite'
        },
        useNullAsDefault: true,
    }
}
