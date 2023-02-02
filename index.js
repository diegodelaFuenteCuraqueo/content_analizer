const { spawn } = require('child_process')
const ffmpeg = require('fluent-ffmpeg')

const audioAnalizer = require('./audioAnalizer')
const videoAnalizer = require('./videoAnalizer')

const videoFilePath = "../terminator.mp4"

const media = {}


function runFfprobe(inputFile) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputFile, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

runFfprobe(videoFilePath)
  .then(data => {
    console.log(" FFPROBE ")
    console.log('Duration:', data.format.duration)
    const duration = data.format.duration
    media.path= videoFilePath,
    media.duration= duration,
    media.startSegment= duration > 10 ? 5 : 0,
    media.endSegment= duration > 10 ? duration - 5 : duration
    return media
  })
  .then(data => {
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
    videoAnalizer.runCommand(cmd.join(" "))
      .then((data) => {
        lines = data.split("\n")
        videoAnalisys = lines[lines.length-2].split(",").map((item) => audioAnalizer.hmsToSeconds(item))
        console.log("data", data)
        console.log("typeof", typeof data)
        console.log('videoAnalisys', videoAnalisys)
        console.log('data split', )
        media.silenceSpots = videoAnalisys
      })
    return data
  })
  .then(data => {
    console.log(" AUDIOANALISYS ", data)
    //const audioAnalisys = audioAnalizer.detectSilence(data)
  })
  .catch(error => {
    console.error(error);
  });


//async function analyze () {
//  ffmpeg.ffprobe(videoFilePath, (err, metadata) => {
//    console.log(" FFPROBE ")
//    if (err) {
//      console.error(err)
//      return
//    }
//    console.log('Duration:', metadata.format.duration)
//    const duration = metadata.format.duration
//    media.duration = duration
//    media.startSegment =  duration > 10 ? 5 : 0
//    media.endSegment = duration > 10 ? duration - 5 : duration
  
//    //videoAnalizer.detectScenes(media)
//  })

//  const cmd = [
//    'scenedetect',
//    '-i',
//    media.path,
//    'time', '--start', `${media.startSegment}s`, '--end', `${media.endSegment}s`,
//    'detect-content',
//    '--threshold', '55',
//    //'save-images',
//    'list-scenes',
//    //"-o",
//    //"output/"
//  ]
//  const videoAnalisys = await videoAnalizer.runCommand(cmd.join(" ")).then((data) => console.log(data))
//  console.log(videoAnalisys)
//}

//analyze()