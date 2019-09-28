'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = plugin;
var createShieldsRenderer = require('./create-shields-renderer');

function plugin(mos, markdown) {
  if (!markdown.repo || markdown.repo.host !== 'github.com') {
    console.warn('The shields plugin only works for github repos');
    return;
  }

  mos.scope.shields = createShieldsRenderer({
    github: markdown.repo,
    pkg: markdown.pkg
  });
}

plugin.attributes = {
  pkg: require('../package.json')
};
module.exports = exports['default'];