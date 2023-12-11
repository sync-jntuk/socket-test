import express from "express"
import cors from "cors"
import { Server } from "socket.io"
import http from "http"
import path from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server Working' })
})

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// ----- SOCKET -----

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
    }
})

io.on('connection', (socket) => {
    socket.on('connected', (msg) => {
        console.log(socket.id + ' : ' + msg)
        socket.emit('server', 'From Server')
    })
    socket.on('disconnect', () => {
        console.log(socket.id + ' : Disconnected')
    })
})

const PORT = 3000
const SOCKET_PORT = 4000

app.listen(PORT, () => {
    console.log(`Server on ${PORT}`)
    server.listen(SOCKET_PORT, () => console.log(`Socket on ${SOCKET_PORT}`))
})

