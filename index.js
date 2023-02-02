const ffmpeg = require('fluent-ffmpeg')

const audioAnalizer = require('./audioAnalizer')
const command = require('./runCommand')

const videoFilePath = "../terminator.mp4"

const media = {}

function runFfprobe(inputFile) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputFile, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

runFfprobe(videoFilePath)
  .then(data => {
    console.log(" FFPROBE ")
    const duration = data.format.duration
    media.path= videoFilePath
    media.duration= duration
    media.startSegment= duration * 0.1
    media.endSegment= duration * 0.9
    return media
  })
  .then(async data => {
    console.log(" AUDIOANALISYS ", data)
    const audioAnalisys = await audioAnalizer.detectSilences(data)
    media.audioSpots = audioAnalisys
    return data
  })
  .then(async data => {
    console.log(" DETECTSCENES ", data)
    let videoAnalisys
    const cmd = [
      'scenedetect',
      '-i',
      data.path,
      'time', '--start', `${data.startSegment}s`, '--end', `${data.endSegment}s`,
      'detect-content',
      '--threshold', '55'//,
      //'save-images',
      //'list-scenes',
      //"-o",
      //"output/"
    ]
    await command.runCommand(cmd.join(" "))
      .then((analisysData) => {
        lines = analisysData.split("\n")
        videoAnalisys = lines[lines.length-2].split(",").map((item) => audioAnalizer.hmsToSeconds(item))
        media.sceneSpots = videoAnalisys
      })
    return data
  })
  .then(data => {
    console.log('media', media)
    return media
  })
  .catch(error => {
    console.error(error);
  });