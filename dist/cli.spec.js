'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _mocha = require('mocha');

var _chai = require('chai');

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pkg = require('../package.json');
var cli = _path2.default.resolve(__dirname, '../bin/mos.js');
var testcwd = _path2.default.resolve(__dirname, 'test-cli');
global.Promise = require('core-js/es6/promise');

function mos(args, opts) {
  return (0, _execa2.default)('node', [cli].concat((0, _toConsumableArray3.default)(args)), opts);
}

(0, _mocha.describe)('cli', function () {
  this.timeout(1e4); // on AppVeyor the 2 seconds timeout is not enough

  (0, _mocha.it)('show version', function () {
    return mos(['--version']).then(function (result) {
      (0, _chai.expect)(result.stderr).to.eq('');
      (0, _chai.expect)(result.stdout).to.have.string(pkg.version);
    });
  });

  (0, _mocha.it)('show version, shortcut', function () {
    return mos(['-v']).then(function (result) {
      (0, _chai.expect)(result.stderr).to.eq('');
      (0, _chai.expect)(result.stdout).to.have.string(pkg.version);
    });
  });

  (0, _mocha.describe)('test', function () {
    (0, _mocha.it)('should pass markdown that is up to date', function () {
      return mos(['test', 'up-to-date.md', '--tap'], {
        cwd: testcwd
      }).then(function (result) {
        return (0, _chai.expect)(result.stdout).to.contain(['TAP version 13', '# markdown', 'ok 1 up-to-date.md', '', '1..1', '# tests 1', '# pass  1', '', '# ok', ''].join('\n'));
      });
    });

    (0, _mocha.it)('should fail markdown that is not up to date', function () {
      return mos(['test', 'not-up-to-date.md', '--tap'], {
        cwd: testcwd
      }).catch(function (result) {
        (0, _chai.expect)(result.stdout).to.have.string(['TAP version 13', '# markdown', 'not ok 1 not-up-to-date.md', '  ---', '    operator: equal', '    expected: |-', "      '<!--@\\'# \\' + pkg.name-->\\n# Bad title\\n<!--/@-->\\n\\nContent\\n'", '    actual: |-', "      '<!--@\\'# \\' + pkg.name-->\\n# slipsum-lite\\n<!--/@-->\\n\\nContent\\n'"].join('\n'));

        (0, _chai.expect)(result.stdout).to.have.string(['  ...', '', '1..1', '# tests 1', '# pass  0', '# fail  1\n\n'].join('\n'));
      });
    });

    (0, _mocha.it)('should use custom options for third-party plugins', function () {
      return mos(['test', 'plugin-options.md', '--tap'], {
        cwd: testcwd
      }).then(function (result) {
        return (0, _chai.expect)(result.stdout).to.contain(['TAP version 13', '# markdown', 'ok 1 plugin-options.md', '', '1..1', '# tests 1', '# pass  1', '', '# ok', ''].join('\n'));
      });
    });

    (0, _mocha.it)('should disable default plugin', function () {
      return mos(['test', 'disable-default-plugin.md', '--tap'], {
        cwd: testcwd
      }).then(function (result) {
        return (0, _chai.expect)(result.stdout).to.contain(['TAP version 13', '# markdown', 'ok 1 disable-default-plugin.md', '', '1..1', '# tests 1', '# pass  1', '', '# ok', ''].join('\n'));
      });
    });
  });
});