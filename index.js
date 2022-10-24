//Desafio 7, Nuestra primera base de datos
//INDEX:JS CONTIENE LA LOGICA DEL SEVIDOR

const express = require('express');                 //Importamos el modulo express
const {Server: HttpServer} = require('http');       //Importamos la clase Server del modulo nativo de nodejs "http" pero le cambiaremos el nombre 
                                                    //por HttpServer para evitar confusiones al trabajar
const {Server: SocketServer} = require('socket.io'); //Importamos el modulo socket.io y le cambiamos el nommbre 
const path = require('path');
const {engine} = require('express-handlebars');
const apiRoutes = require('./routers/routers');
const fs = require("fs");                           //Importamos el modulo file System

//A continuacion la configuración básica de un servidor http con socket en conjunto
const PORT = process.env.PORT || 8080;              //Configuramos el puerto por la variable de entorno O por el 8080
const app = express();                              //Instanciamos el modulo express
const httpServer = new HttpServer(app);             //instanciamos el servidor http, pasando por parametro la instancia de express
const io = new SocketServer(httpServer);            //intanciamos el servidor socket pasando como parametro la intancia http

//Objeto de configuracion Bases de datos
const dbConfig = require('./db/config.js')         //Importamos nuestro objeto de configuracion Knex
                           

//Configuración del motor de plantilla para el uso de HANDLEBARS
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: path.resolve(__dirname, './views/layouts'),
    partialsDir: path.resolve(__dirname, './views/partials')
}));

app.set('views','./views');                 //Indicamos a express la ruta de nuestra plantilla
app.set('view engine', 'hbs');              //Indicamos a express el motor de plantillas a usar

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));                //Archivos estaticos

//Routes
app.use('/api', apiRoutes);                 //Ruta a routers.js con prefijo /api

//clases importadas
const ApiProductos = require('./api/apiProductos.js');          //Importamos la clase ApiProductos
const apiProductos = new ApiProductos('tablaproductos');        //Nueva instancia de la clase ApiProductos, recibe el nombre de la tabla en la base de datos mariaDB
const ApiChat = require('./api/apiMensajesChatDB.js');          //Importamos la clase ApiChat
const apiChat = new ApiChat(dbConfig.sqlite3, 'tablaChat')       //Nueva instancia de la clase ApiChat, recibe la configruacion de sqlite y el nombre de la tabla en la base de datos



//Listen
httpServer.listen(PORT, ()=> {
    console.log("Server is up and running on port ", PORT);
})

//Eventos socket

// El metodo on, escuchara por el evento 'connection'
io.on('connection', async (socket)=> {
    
    console.log("New client connection! (nuevo cliente conectado)");            //Muestra mensaje en la consola cuando se conecta un nuevo cliente
    console.log(socket.id);                                                     //Muestra por consola el id del nuevo cliente conectado.
    //console.log(messages);
     
    //socket.emit('messages', messages);                                          
    socket.emit('messages', await apiChat.getAll());                                             //Emite un evento llamado messages, manda el resultado de la clase apiChat.getAll para obtener todo el historial de chat
    socket.emit('productos', await apiProductos.getAll());                                       //Emite un evento llamado productos, que manda como parametro la lista de productos
    
    //Escucha por los mensajes emitido por el lado del cliente con el metodo on
    socket.on('new-message',data => {

        //messages.push(data);
        //io.sockets.emit('messages', messages);
        io.sockets.emit('messages', apiChat.getAll());
        //fs.writeFileSync("./chat_data_log/chat_log.json", JSON.stringify(messages));        //Escribe el log del chat en un archivo
        apiChat.adNew(data);                                                                    //Guarda el nuevo mensaje de chat en la base de datos

    });

    //Escucha por los cambios en la tabla de productos      
    socket.on('cambio-tabla-productos',data => {

       
        io.sockets.emit('productos', apiProductos.getAll());        //emite a todos los sockets un evento llamado 'productos' y el metodo getAll
        apiProductos.addNew(data);                                  //Recibe data de un nuevo producto y lo pasa como argumento a la funcion addNew
    });

})