
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({dev})
const nextHandler = nextApp.getRequestHandler()

const {createChatroom, checkIfDocExists, sendMessage, getStoredMessages} = require('./firebase/client.js')

// Socket io

io.on('connection', socket => {

    socket.on('set:chatroom_id', chatroom_id => {
        createChatroom(chatroom_id)  
    })

    // Recibir y guardar mensajes
    socket.on(`send:message`, async data => {
        const {message, id} = data
        socket.join(id)
        await sendMessage(message, id)
        io.to(id).emit(`send:message`, message)
        // socket.broadcast.emit(`chatrooom:one`, message) Para enviar a todos menos a mi
    })

    socket.on('disconnect', () => {
        console.log('disconnected')
    })
})



nextApp.prepare().then(() => {
    app.get('/messages/:id', (req, res) => {
    checkIfDocExists(req.params.id).then((exists) => {
        if (exists) {
            getStoredMessages(req.params.id)
                .then(
                    chat => {
                        res.json(chat)
                    }
                )        
        }
        else {
            res.json([])
        }
    })
    })
    app.get('*', (req, res) => {
        return nextHandler(req, res)
    })
    server.listen(port, err => {
        if (err) throw err
        console.log('> Ready on http://localhost:', port)
    })
})