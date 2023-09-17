//node_module
import express from 'express'
import mongoose from 'mongoose'
import { engine } from 'express-handlebars';
import { Server }  from 'socket.io'
import dotenv from 'dotenv';
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';


//Importacion de rutas
import viewRouter from './routes/views.routes.js'
import apiRouter from './routes/apis.routes.js';

//Importacion de otros modulo
import { __dirname } from './path.js';
import { messageModel } from "./dao/models/messages.models.js"
import { productModel } from './dao/models/products.models.js';
import path from 'path';

//Setup inicial
const viewsRouter = viewRouter;
const apisRouter = apiRouter;
dotenv.config();
const app = express()
const PORT = 4000

const server =  app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`)
})

// conexion a la base de datos de mongodb
mongoose.connect(`mongodb+srv://curso_backend_juan:${process.env.passmongodb}@cluster0.c47d4cv.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('BDD conectada'))
    .catch(() => console.log('Error en conexion a BDD'))

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


///
const hbs = exphbs.create({
    defaultLayout: 'main', // si tienes un layout principal, coloca su nombre aquí
    handlebars: Handlebars, 
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

app.engine('handlebars', hbs.engine) //Defino que motor de plantillas voy a utilizar y su config
app.set('view engine', 'handlebars') //Setting de mi app de hbs
app.set('views', path.resolve(__dirname, './views')) //Resolver rutas absolutas a traves de rutas relativas
app.use('/static', express.static(path.join(__dirname, '/public'))) //Unir rutas en una sola concatenandolas
app.use('/realtimeproducts', express.static(path.join(__dirname, '/public')))

// Server de socket.io
const io = new Server(server);

io.on('connection', (socket)=> {
    console.log('servidor de socket io conectado')

    socket.on('add-message', async ({email, mensaje}) => {
        console.log(mensaje)
        await messageModel.create({email: email, message: mensaje})
        const messages = await messageModel.find();
        socket.emit('show-messages', messages);
    })

    socket.on('display-inicial', async() =>{
        const messages = await messageModel.find();
        socket.emit('show-messages', messages);
    })

    socket.on('add-product', async (nuevoProd) => {
        const { title, description, price, code, stock, category } = nuevoProd;
        await productModel.create({title: title, description: description, price: price, code: code, stock: stock, category: category});
        const products = await productModel.find();
        socket.emit('show-products', products);
    })

    socket.on('update-products', async () => {
        const products = await productModel.find();
        console.log(products)
        socket.emit('show-products', products);
    });

    socket.on('remove-product', async ({ code }) => {
        try {
            console.log("inicio remove socket")
            await productModel.deleteOne({ code: code });
            const products = await productModel.find();
            socket.emit('show-products', products);
        }catch (error) {
            console.error('Error eliminando producto:', error);
        }

    })
})

app.use('/',viewsRouter)
app.use('/api',apisRouter)
