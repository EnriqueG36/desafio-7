//Api para escribir/leer los productos de la base de datos mariaDB
const dbConfig = require('../db/config.js')
//const { default: knex } = require("knex");



class ApiProductos{
    constructor (nombreTabla) {
        this.knex = require("knex")(dbConfig.mariaDB);
        this.nombreTabla = nombreTabla;
    }

//Metodo para leer todos los registros de la tabla
async getAll(){
    try{
    let productos = await this.knex.from(this.nombreTabla).select('id','title','price','thumbnail');
    //console.log(this.nombreTabla);
    
    //console.log("llamada a get all productos");
    //console.log(productos);
    //let objetoProductos = JSON.stringify(productos);   
    //productos = JSON.parse(objetoProductos)   
    //console.log(productos);
    return productos;
    }
    catch(error){
        console.log(error);
    }
}

async addNew(body){

    const {title, price, thumbnail} = body;
    if (!title || !price || !thumbnail) {
        return ({error: "Formato del cuerpo incorrecto"})
    }
    try{
        await this.knex(this.nombreTabla).insert(body);
    }
   catch(error){
    console.log(error);
   }
    
}
}

module.exports = ApiProductos;