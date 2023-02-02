const { spawn } = require('child_process')
const ffmpeg = require('fluent-ffmpeg')

const audioAnalizer = require('./audioAnalizer')
const videoAnalizer = require('./videoAnalizer')

const videoFilePath = "../I\'ll\ be\ back.mp4"

const media = {
  path: videoFilePath,
}

ffmpeg.ffprobe(videoFilePath, (err, metadata) => {
  console.log(" FFPROBE ")
  if (err) {
    console.error(err)
    return
  }
  console.log('Duration:', metadata.format.duration)
  const duration = metadata.format.duration
  media.duration = duration
  media.startSegment =  duration > 10 ? 5 : 0
  media.endSegment = duration > 10 ? duration - 5 : duration

  //videoAnalizer.detectScenes(media)
  const audioAnalisys = audioAnalizer.detectSilences(media)
  console.log(audioAnalisys)
})

//console.log(media)
