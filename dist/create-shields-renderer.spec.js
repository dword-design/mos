'use strict';

var _createShieldsRenderer = require('./create-shields-renderer');

var _createShieldsRenderer2 = _interopRequireDefault(_createShieldsRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var describe = require('mocha').describe;
var it = require('mocha').it;
var expect = require('chai').expect;


describe('createShieldsRenderer', function () {
  it('should create flat shield by default', function () {
    var shields = (0, _createShieldsRenderer2.default)({
      github: {
        user: 'zkochan',
        repo: 'mos'
      },
      pkg: {
        name: 'mos'
      }
    });
    expect(shields('travis')).to.eq('[![Build Status](https://img.shields.io/travis/zkochan/mos/master.svg)](https://travis-ci.org/zkochan/mos)');
  });

  it('should create flat travis shield', function () {
    var shields = (0, _createShieldsRenderer2.default)({
      github: {
        user: 'zkochan',
        repo: 'mos'
      },
      pkg: {
        name: 'mos'
      }
    });
    expect(shields.flat('travis')).to.eq('[![Build Status](https://img.shields.io/travis/zkochan/mos/master.svg?style=flat)](https://travis-ci.org/zkochan/mos)');
  });

  it('should create flat square travis shield', function () {
    var shields = (0, _createShieldsRenderer2.default)({
      github: {
        user: 'zkochan',
        repo: 'mos'
      },
      pkg: {
        name: 'mos'
      }
    });
    expect(shields.flatSquare('travis')).to.eq('[![Build Status](https://img.shields.io/travis/zkochan/mos/master.svg?style=flat-square)](https://travis-ci.org/zkochan/mos)');
  });

  it('should create plastic travis shield', function () {
    var shields = (0, _createShieldsRenderer2.default)({
      github: {
        user: 'zkochan',
        repo: 'mos'
      },
      pkg: {
        name: 'mos'
      }
    });
    expect(shields.plastic('travis')).to.eq('[![Build Status](https://img.shields.io/travis/zkochan/mos/master.svg?style=plastic)](https://travis-ci.org/zkochan/mos)');
  });

  it('should create several shields', function () {
    var shields = (0, _createShieldsRenderer2.default)({
      github: {
        user: 'zkochan',
        repo: 'mos'
      },
      pkg: {
        name: 'mos'
      }
    });
    expect(shields.plastic('travis', 'npm')).to.eq(['[![Build Status](https://img.shields.io/travis/zkochan/mos/master.svg?style=plastic)](https://travis-ci.org/zkochan/mos)', '[![npm version](https://img.shields.io/npm/v/mos.svg?style=plastic)](https://www.npmjs.com/package/mos)'].join(' '));
  });

  it('should throw exception if shield not supported', function () {
    var shields = (0, _createShieldsRenderer2.default)({
      github: {
        user: 'zkochan',
        repo: 'mos'
      },
      pkg: {
        name: 'mos'
      }
    });
    expect(function () {
      return shields('no-such-shield');
    }).to.throw(Error, '`no-such-shield` shield is not supported');
  });
});