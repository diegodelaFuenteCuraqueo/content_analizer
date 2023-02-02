//const ffmpeg = require('fluent-ffmpeg')

//const audioAnalizer = require('./audioAnalizer')
//const command = require('./runCommand')

import { analyzeMedia } from './analizer'
const videoFilePath = "../terminator.mp4"

const data = analyzeMedia(videoFilePath)

console.log("DATA", data)