const { spawn } = require('child_process')
const ffmpeg = require('fluent-ffmpeg')

const audioAnalizer = require('./audioAnalizer')

const detectScenes = (media) => {
  console.log(" DETECTSCENES ")
  const scenedetect = spawn('scenedetect', [
    '-i',
    media.path,
    'time', '--start', `${media.startSegment}s`, '--end', `${media.endSegment}s`,
    'detect-content',
    '--threshold', '55',
    //'save-images',
    'list-scenes',
    //"-o",
    //"output/"
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

module.exports = {detectScenes}