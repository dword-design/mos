'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var describe = require('mocha').describe;
var it = require('mocha').it;
var expect = require('chai').expect;

describe('mosPluginShields', function () {
  it('should not throw error when package hosted not on GitHub', function () {
    expect(function () {
      return (0, _index2.default)({}, { repo: { host: 'gitlab' } });
    }).to.not.throw(Error, 'The shields plugin only works for github repos');
  });
});