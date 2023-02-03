const { spawn } = require('child_process')

let dbThreshold = -90
let timeThreshold = 3

function detectSilences (media, config = {}) {
  const silences = []
  var ffmpegSilenceDetector = spawn(
    'ffmpeg',
    [
      '-i', media.path,
      //'-ss', secToHHMMSS(media.startSegment),
      //'-to', secToHHMMSS(media.endSegment),
      '-af', `silencedetect=n=${config.silenceThreshold || dbThreshold}dB:d=${config.timeThreshold || timeThreshold}`,
      '-f', 'null',
      '-y', 'pipe:1'
    ]
  )
  ffmpegSilenceDetector.on('message', function(data) {
    console.log('ffmpeg2 PARENT got message:', JSON.stringify(data))
  })

  ffmpegSilenceDetector.stderr.on('data', function(data) {
    const parsed = data.toString('utf8').split(" ")
    if(parsed.includes("frame=")){
      const timeHMS = parsed.find((element) => element.includes("time=")).slice(5)
      silences.push(hmsToSeconds(timeHMS))
      console.log("silence at", timeHMS, hmsToSeconds(timeHMS) )
    }
  })

  ffmpegSilenceDetector.on('exit', function (code, signal) {
    console.log('child process exited with code:' + code + ' signal:' + signal)
  })

  return new Promise((resolve, reject) => {
    resolve(silences);
  });
}

function hmsToSeconds(time) {
  var parts = time.split(':')
  return (parseInt(parts[0]) * 3600) + (parseInt(parts[1]) * 60) + parseInt(parts[2])
}

function secToHHMMSS(seconds) {
  let hours = Math.floor(seconds / 3600)
  let minutes = Math.floor((seconds - (hours * 3600)) / 60)
  let secs = Math.floor(seconds - (hours * 3600) - (minutes * 60))

  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  secs = secs < 10 ? '0' + secs : secs

  return hours + ':' + minutes + ':' + secs
}

module.exports = {detectSilences, hmsToSeconds, secToHHMMSS}

