const { spawn } = require('child_process')
const ffmpeg = require('fluent-ffmpeg')

const videoFilePath = "../I\'ll\ be\ back.mp4"

const video = {
  path: videoFilePath,
}

ffmpeg.ffprobe(videoFilePath, (err, metadata) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('Duration:', metadata.format.duration)
  const duration = metadata.format.duration
  video.duration = duration
  video.startSegment =  duration > 10 ? 5 : 0
  video.endSegment = duration > 10 ? duration - 5 : duration
  convert()
})

console.log(video)

const convert = () => {
  const scenedetect = spawn('scenedetect', [
    '-i',
    video.path,
    'detect-content',
    '--threshold', '55',
    'save-images',
    'list-scenes',
    "-o",
    "output/"
  ])

  scenedetect.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  scenedetect.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  scenedetect.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
}