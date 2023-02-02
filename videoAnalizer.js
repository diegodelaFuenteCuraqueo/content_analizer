const { exec } = require('child_process')

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
  console.log(cmd.join(' '))
  return runCommand(`scenedetect ${cmd.join(' ')}`)
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log("ERROR")
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

module.exports = {detectScenes, runCommand}