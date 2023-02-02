const { exec } = require('child_process')

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

module.exports = {runCommand}