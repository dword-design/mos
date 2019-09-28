'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shieldman = require('shieldman');

var _shieldman2 = _interopRequireDefault(_shieldman);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slice = Array.prototype.slice;

exports.default = function (opts) {
  var github = opts.github;
  var pkg = opts.pkg;

  var shields = styledShield();
  shields.flat = styledShield('flat');
  shields.flatSquare = styledShield('flat-square');
  shields.plastic = styledShield('plastic');

  return shields;

  function styledShield(style) {
    var shieldOpts = {
      repo: github.user + '/' + github.repo,
      npmName: pkg.name,
      branch: 'master',
      style: style
    };
    return function () {
      var shields = slice.call(arguments);
      return shields.map(function (shieldName) {
        var shieldProps = (0, _shieldman2.default)(shieldName, shieldOpts);
        if (!shieldProps) {
          throw new Error('`' + shieldName + '` shield is not supported');
        }
        return shieldProps;
      }).map(renderShield).join(' ');
    };
  }
};

function renderShield(shieldProps) {
  return '[![' + shieldProps.text + '](' + shieldProps.image + ')](' + shieldProps.link + ')';
}
module.exports = exports['default'];