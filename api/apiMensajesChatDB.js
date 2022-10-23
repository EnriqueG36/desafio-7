//api para escribir los mensajes de chat en la base de datos de sqlite


class Apichat {
    constructor (configuracion, nombreTabla) {
        this.knex = require("knex")(configuracion);
        this.nombreTabla = nombreTabla;
    }

    //Metodo para obtener los mensajes almacenados en la db
    async getAll(){
        try{
            console.log("Lamma da a getAll chat")
            const chat = await this.knex.from(this.nombreTabla).select('*');

            return chat;
        }
        catch(error)
        {
            console.log(error)
        }
    }

    async adNew(mensajeRecibido) {
       
    const {author, messageDate, text} = mensajeRecibido;
    if (!author || !messageDate || !text) {
        return ({error: "Formato del cuerpo incorrecto"})
    }
    try{
        await this.knex(this.nombreTabla).insert(mensajeRecibido);
    }
   catch(error){
    console.log(error);
    }
    }
}

module.exports = Apichat;