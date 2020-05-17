var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    urlencoded: false
}))

mongoose.Promise = Promise

const dbURL = 'mongodb+srv://user:user@testcluster-qbutv.mongodb.net/test?retryWrites=true&w=majority'

// MongoDB Model
var Message = mongoose.model('message', {
    name: String,
    message: String
})

// GET Request
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

// POST Request
app.post('/messages', async (req, res) => {

    try {

        // throw 'some error'

        var message = new Message(req.body);

        var savedMessage = await message.save()
        console.log('saved')
    
        var censored = await Message.findOne({
            message: 'badword'
        })
    
        if (censored)
            await Message.remove({_id: censored.id})
        else
            io.emit('message', req.body)
            
        res.sendStatus(200)
    } catch {
        res.sendStatus(500)
        return console.error(err) 
    } finally {
        logger.log("POST Successful")
    }
})


// Socket.io Connection
io.on('connection', (socket) => {
    console.log("User Connected")
})

// MongoDB Mongoose Connection
mongoose.connect(dbURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, (err) => {
    console.log("MongoDB Connection", err)
})

var server = http.listen(3000, () => {
    console.log("Server is listening on port: ", server.address().port)
})