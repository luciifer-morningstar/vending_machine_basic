const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/crud'
var busboy = require('connect-busboy');

const app = express()
app.use(busboy());
mongoose.connect(url, {useNewUrlParser:true})
const con = mongoose.connection
con.on('open', () => {
    console.log('connected...')
})

app.use(express.json())
app.use(express.static(__dirname + '/public'));

const route = require('./routes/route')
app.use('/api',route)

app.listen(3000, () => {
    console.log('Server started')
})
