const { spawn } = require('child_process')
const ffmpeg = require('fluent-ffmpeg')

const audioAnalizer = require('./audioAnalizer')

const detectScenes = (media) => {
  console.log(" DETECTSCENES ")
  const cmd = [
    '-i',
    media.path,
    'time', '--start', `${media.startSegment}s`, '--end', `${media.endSegment}s`,
    'detect-content',
    '--threshold', '55',
    //'save-images',
    'list-scenes',
    //"-o",
    //"output/"
  ]
  return runCommand(`scenedetect ${cmd.join(' ')}`)

  //const scenedetect = spawn('scenedetect', cmd)

  //scenedetect.stdout.on('data', (data) => {
  //  console.log(`stdout: ${data}`)
  //})

  //scenedetect.stderr.on('data', (data) => {
  //  console.error(`stderr: ${data}`)
  //})

  //scenedetect.on('close', (code) => {
  //  console.log(`child process exited with code ${code}`)
  //})
}


function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

module.exports = {detectScenes}