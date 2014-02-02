var log = require('callback-logger')();

exports.coffee = function() {
  var coffee = require('coffee-files');

  coffee.file('files/coffee/a.coffee', 'tmp/coffee/a1.js');

  coffee.file('files/coffee/a.coffee', 'tmp/coffee/a2.js', { sourceMap: true }, log.cb('Built coffee file'));

  coffee.glob('*.coffee', 'files/coffee',
              'tmp/coffee/all', { sourceMapDir: 'tmp/coffee/maps', watch: true },
              log.cb('Built <%= res.length %> coffee files'), log.cb('Updated <%= res.outputFile %>'), log.cb('Removed <%= res %> '));
}

exports.less = function() {
  var less = require('less-files');

  less.file('files/less/a.less', 'tmp/less/a1.css');

  less.file('files/less/a.less', 'tmp/less/a2.css', { sourceMap: true }, log.cb('Built less file'));

  less.glob('*.less', 'files/less',
              'tmp/less/all', { sourceMapDir: 'tmp/less/maps', watch: true },
              log.cb('Built <%= res.length %> less files'), log.cb('Updated <%= res.outputFile %>'), log.cb('Removed <%= res %> '));
}

exports.minify = function() {
  var uglify = require('uglify-files');

  uglify('files/js/s.js', 'tmp/uglify/s.js.min', log.cb('Minified <%= res.outputFile %>, now has <%= res.outputData.length %> bytes'));

  uglify([ 'files/js/s.js', 'files/js/t.js' ], 'tmp/uglify/build.js.min', log.cb('Minified <%= res.outputFile %>, now has <%= res.outputData.length %> bytes'));
}

exports.concat = function() {
  var concat = require('concatenate-files');

  concat([ 'files/css/a.css', 'files/css/b.css' ], 'tmp/concat/concat.css', log.cb('Generated <%= res.outputFile %>'));

  concat([ 'files/js/s.js', 'files/js/t.js' ], 'tmp/concat/concat.js', { separator: ';' }, log.cb('Generated <%= res.outputFile %>'));
}

exports.useref = function() {
  var useref = require('useref-file');

  useref('files/useref.html', 'tmp/useref', log.cb("replaced references in index.html and wrote <%= _.size(res) %> files"))

  useref('files/useref.html', 'tmp/useref2', { handlers: { js: 'uglify' } }, log.cb("replaced references in index.html and wrote <%= _.size(res) %> files"))
}

exports.server = function() {
  var server = require('livereload-static-server'),
      watchGlob = require('watch-glob');

  var livereload = server('tmp', 3001)
  log.success("Server running on port 3001")

  // Watch files and trigger livereload
  watchGlob([ 'tmp/**/*.+(js|css)' ], function(changedFile) {
    livereload(changedFile.path);
    log.success("Reloading")
  });



  // Alternative version
  watchGlob([ 'tmp/**/*' ], { callbackArg: 'absolute' }, livereload);


  // Alternative version
  watchGlob([ 'tmp/**/*.+(js|css)' ], function(changedFile) {
    var reloadedClients = livereload(changedFile.path);
    if(reloadedClients > 0) {
      log.success("reloading " + reloadedClients + " client(s)")
    }
  });

}

exports.clean = function() {
  var rimraf = require('rimraf');
  rimraf('tmp/coffee/a1.js', log.cb('Cleaned file'));
}

exports.clean2 = function() {
  var rimraf = require('rimraf');
  rimraf('tmp/', log.cb('Cleaned folder'));
}


exports.copy = function() {
  var fs = require('fs-extra');
  fs.copy('files/foo.txt', 'tmp/copy/foo.txt');
}

exports.copy2 = function() {
  var fs = require('fs-extra');
  fs.copy('files/coffee', 'tmp/copy/coffee');
}