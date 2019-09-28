'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = processFiles;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function processFiles(opts) {
  opts = opts || {};
  var afterEachRender = opts.afterEachRender;
  var process = opts.process;
  var pattern = opts.pattern;
  var ignore = ['**/node_modules/**'];
  if (opts.ignorePattern) {
    ignore.push(opts.ignorePattern);
  }

  return new _promise2.default(function (resolve, reject) {
    (0, _glob2.default)(pattern, { ignore: ignore }, function (err, files) {
      if (err) {
        return reject(err);
      }

      _promise2.default.all(files.map(processFile)).then(resolve).catch(reject);
    });

    function processFile(filePath) {
      var currentMD = _fs2.default.readFileSync(filePath, 'utf8');
      return process({ content: currentMD, filePath: filePath }).then(function (newMD) {
        return afterEachRender({
          newMD: newMD,
          currentMD: currentMD,
          filePath: filePath
        });
      });
    }
  });
}
module.exports = exports['default'];