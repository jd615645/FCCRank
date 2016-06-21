var exec = require('child_process').exec;

exec('python fcc.py', function(err, stdout, stderr) {
  if(err) {
    console.log(stderr);
  }
  else {
    console.log('run');
  }
});
