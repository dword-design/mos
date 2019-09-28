'use strict';

var _mocha = require('mocha');

var _processFiles = require('./process-files');

var _processFiles2 = _interopRequireDefault(_processFiles);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promise = require('core-js/es6/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('render-files', function () {
  (0, _mocha.it)('should render files by pattern', function (done) {
    (0, _processFiles2.default)({
      pattern: _path2.default.join(__dirname, '/test-cli/*.md'),
      process: function process() {
        return _promise2.default.resolve();
      },
      afterEachRender: function afterEachRender() {},
      ignorePattern: 'ignore_this_path'
    }).then(function () {
      return done();
    }).catch(done);
  });
});