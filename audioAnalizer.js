const { spawn } = require('child_process')
const ffmpeg = require('fluent-ffmpeg')

let dbThreshold = -70
let timeThreshold = 0.5

function detectSilences (media) {
  const silences = {}
  var ffmpegSilenceDetector = spawn('ffmpeg', ['-i',media.path,'-af',`silencedetect=n=${dbThreshold}dB:d=${timeThreshold}`, '-f', 'null','-y', 'pipe:1' ])
  ffmpegSilenceDetector.on('message', function(data) {
    console.log('ffmpeg2 PARENT got message:', JSON.stringify(data))
  })

  ffmpegSilenceDetector.stderr.on('data', function(data) {

    silences.markers = []

    const parsed = data.toString('utf8').split(" ")
    if(parsed.includes("frame=")){
      const timeHMS = parsed.find((element) => element.includes("time=")).slice(5)
      const frame = parsed.find((element) => element.includes("time=")).slice(5)

      //console.log('ffmpeg stderr data = ', data.toString('utf8').split(" "))
      console.log('ffmpeg stderr data = ', timeHMS)
      silences.markers.push(hmsToSeconds(timeHMS))
    }
    //console.log(JSON.stringify(data))
  })

  ffmpegSilenceDetector.on('exit', function (code, signal) {
    console.log('child process exited with code:' + code + ' signal:' + signal)
  })

  return silences
}

function hmsToSeconds(time) {
  var parts = time.split(':')
  return (parseInt(parts[0]) * 3600) + (parseInt(parts[1]) * 60) + parseInt(parts[2])
}

module.exports = {detectSilences, hmsToSeconds}