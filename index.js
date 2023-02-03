const { analyseMedia } = require('./analizer')
const express = require('express')
const fs = require('fs')
const expressFileUpload = require('express-fileupload')
const app = express()
const bodyParser = require('body-parser')
const http = require('http');
const server = http.createServer(app)
const path = require("path");

let mediaData = {}

// using bodyparser: x-www-form-urlencoded, json
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// main route
app.get('/', (req,res)=>{
  console.log(" ~ accediendo a /")
  return res.sendFile(__dirname + '/analisys.html')
})

app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)

app.post('/analyse', async (req,res) => {
  console.log(" ~ accediendo a /analyse")
  mediaData = {}
  let to = req.body.to
  let file = req.files.file
  console.log('file', file)

  file.mv("tmp/" + file.name, (err) => {
    if (err) return res.sendStatus(500).send("ERROR", err)
    console.log("archivo subido correctamente")
  })

  await analyseMedia("tmp/" + file.name).then((_data) => {
    mediaData = _data
    console.log("DATA", mediaData)
    //return res.sendFile(__dirname + '/analisys.html')
  })
  return
})

app.get('/analysedContent', (req,res)=>{
  console.log(" ~ accediendo a /analysedContent")
  _mediaData = Object.assign({}, mediaData)
  console.log(_mediaData)
  return res.json(_mediaData)
})

const port = process.env.PORT || 9090
app.listen(port, () => {
  console.log("listening to port " + port)
})
