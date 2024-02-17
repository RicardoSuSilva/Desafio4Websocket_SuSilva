import express from 'express'
import cartRouter from './routes/cartRouter.js'
import productsRouter from './routes/productsRouter.js'
import upload from './config/multer.js'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'


//Configuraciones o declaraciones
const app = express()
const PORT = 8000

//Server

const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
const io = new Server(server)

//Middlewares
app.use(express.json())
app.use('/static', express.static(__dirname + '/public'))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

io.on('connection', (socket) => {
    console.log("Conexion con Socket.io")

    socket.on('movimiento', info => { //Cuando el cliente me envia un mensaje,
    //lo capturo y lo muestro
        console.log(info)
    })

    socket.on('rendirse', info => { //Cuando el cliente me envia un mensaje,
        //lo capturo y lo muestro
        console.log(info)
        socket.emit('mensaje-jugador', "Te has rendido") //Cliente que envio mensaje
        socket.broadcast.emit('rendicion', "El jugador se rendio") //Clientes que tengan 
        //establecida la comunicacion con el servidor
})
})

//Routes
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.post('/upload', upload.single('product'), (req, res) => {
    try {
        console.log(req.file)
        res.status(200).send("Imagen cargada correctamente")
    } catch (e) {
        res.status(500).send("Error al cargar imagen")
    }
})
app.get('/static', (req,res) => {
    
        const prods = [
            {id:1, title: "Celular", price: 1500, img: "./img/img-11.png"},
            {id:2, title: "Televisor", price: 1800, img: "./img/img-11.png"},
            {id:3, title: "Tablet", price: 1200, img: "./img/img-11.png"},
            {id:4, title: "Notebook", price: 1900, img: "./img/img-11.png"}

        ]

        res.render('products', {
            mostrarProductos: true,
            productos: prods,
        css: 'product.css',
    })
})
