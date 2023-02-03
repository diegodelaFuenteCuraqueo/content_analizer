const { analyseMedia } = require('./analizer')
const express = require('express')
const fs = require('fs')
const expressFileUpload = require('express-fileupload')
const app = express()
const bodyParser = require('body-parser')

const videoFilePath = "../dance.mp4"

// using bodyparser: x-www-form-urlencoded, json
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// main route
app.get('/', (req,res)=>{
  console.log(" ~ accediendo a /")
  return res.sendFile(__dirname + '/index.html')
})

app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)

// index.html convert form
app.post('/convert', (req,res)=>{
  console.log(" ~ accediendo a /convert")
  let to = req.body.to
  let file = req.files.file
   // console.log(to)
  console.log('file', file)

  file.mv("tmp/" + file.name, (err) => {
    if (err) return res.sendStatus(500).send("ERROR", err)
    console.log("archivo subido correctamente")
  })

  analyseMedia("tmp/" + file.name).then((_data) => {
    data = _data
    console.log("DATA", data)
  })
})

const port = process.env.PORT || 9090
app.listen(port, () => {
  console.log("listening to port " + port)
})
