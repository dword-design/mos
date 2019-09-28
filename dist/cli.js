'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _updateNotifier = require('update-notifier');

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _processFiles = require('./process-files');

var _processFiles2 = _interopRequireDefault(_processFiles);

var _normalizeNewline = require('normalize-newline');

var _normalizeNewline2 = _interopRequireDefault(_normalizeNewline);

var _relative = require('relative');

var _relative2 = _interopRequireDefault(_relative);

var _normalizePath = require('normalize-path');

var _normalizePath2 = _interopRequireDefault(_normalizePath);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _mosTapDiff = require('mos-tap-diff');

var _mosTapDiff2 = _interopRequireDefault(_mosTapDiff);

var _mosReadPkgUp = require('mos-read-pkg-up');

var _mosReadPkgUp2 = _interopRequireDefault(_mosReadPkgUp);

var _rcfile = require('rcfile');

var _rcfile2 = _interopRequireDefault(_rcfile);

var _mosProcessor = require('mos-processor');

var _mosProcessor2 = _interopRequireDefault(_mosProcessor);

var _defaultPlugins = require('./default-plugins');

var _defaultPlugins2 = _interopRequireDefault(_defaultPlugins);

var _resolveFrom = require('resolve-from');

var _resolveFrom2 = _interopRequireDefault(_resolveFrom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();
var stdout = process.stdout;

var cli = (0, _meow2.default)(['Usage', '  mos [test] [files]', '', 'Options', ' --init             Add mos to your project', ' --help, -h         Display usage', ' --version, -v      Display version', ' --tap              Generate TAP output when testing markdown files', '', ' -x="<exclude-pattern>"', '                    Exclude pattern', '', 'Examples', '  mos', '  mos test', '  mos test README.md', '  mos --init', '  mos --init README.md', '', 'Tips:', '  Add `mos test` to your `scripts.test` property in `package.json`'].join('\n'), {
  alias: {
    help: 'h',
    version: 'v'
  }
});

(0, _updateNotifier2.default)({ pkg: cli.pkg }).notify();

if (cli.flags.init) {
  require('mos-init')();
} else {
  var highlightPath = _chalk2.default.bgBlack.yellow;

  var isTest = ~['test', 't'].indexOf((cli.input[0] || '').toLowerCase());

  var processMD = function processMD(md) {
    return (0, _mosReadPkgUp2.default)({ cwd: md.filePath }).then(function (result) {
      var pkg = result.pkg;
      var config = (0, _rcfile2.default)('mos', { cwd: _path2.default.dirname(md.filePath) });
      var allDeps = new _set2.default([].concat((0, _toConsumableArray3.default)((0, _keys2.default)(pkg.dependencies || {})), (0, _toConsumableArray3.default)((0, _keys2.default)(pkg.devDependencies || {}))));

      var pkgPlugins = (config.plugins || []).map(function (plugin) {
        return plugin instanceof Array ? { name: plugin[0], options: plugin[1] || {} } : { name: plugin, options: {} };
      }).map(function (plugin) {
        var namespacedName = 'mos-plugin-' + plugin.name;
        if (allDeps.has(namespacedName)) {
          return (0, _extends3.default)({}, plugin, { name: namespacedName });
        }
        if (allDeps.has(plugin.name)) {
          return plugin;
        }
        throw new Error(plugin.name + ' is not in the dependencies');
      }).map(function (plugin) {
        return (0, _extends3.default)({}, plugin, { path: (0, _resolveFrom2.default)(_path2.default.dirname(md.filePath), plugin.name) });
      }).map(function (plugin) {
        return (0, _extends3.default)({}, plugin, { path: (0, _normalizePath2.default)(plugin.path) });
      }).map(function (plugin) {
        return (0, _extends3.default)({}, plugin, { register: require(plugin.path) });
      });

      var defaultPluginsWithOpts = _defaultPlugins2.default.reduce(function (defPlugins, defPlugin) {
        var defPluginName = defPlugin.attributes.pkg && defPlugin.attributes.pkg.name || defPlugin.attributes.name;
        var options = config[defPluginName] || config[defPluginName.replace(/^mos-plugin-/, '')];
        if (options === false) {
          return defPlugins;
        }
        return [].concat((0, _toConsumableArray3.default)(defPlugins), [{
          register: defPlugin,
          options: options
        }]);
      }, []);

      return (0, _mosProcessor2.default)(md, [].concat((0, _toConsumableArray3.default)(defaultPluginsWithOpts), (0, _toConsumableArray3.default)(pkgPlugins)));
    }).then(function (processor) {
      return processor.process();
    });
  };

  var mdExtensions = ['markdown', 'mdown', 'mkdn', 'mkd', 'md'];
  var files = cli.input[isTest ? 1 : 0];
  var pattern = files ? _path2.default.resolve(cwd, files) : _path2.default.resolve(cwd, '{/**/,/}*.{' + mdExtensions.join() + '}');
  var ignorePattern = cli.flags.x ? _path2.default.resolve(cwd, cli.flags.x) : null;

  if (isTest) {
    if (cli.flags.tap !== true) {
      _tape2.default.createStream().pipe((0, _mosTapDiff2.default)()).pipe(stdout);
    }
    (0, _tape2.default)('markdown', function (t) {
      (0, _processFiles2.default)({
        process: processMD,
        pattern: pattern,
        ignorePattern: ignorePattern,
        afterEachRender: function afterEachRender(opts) {
          var relativePath = (0, _normalizePath2.default)(getRelativePath(opts.filePath));
          t.equal((0, _normalizeNewline2.default)(opts.newMD), (0, _normalizeNewline2.default)(opts.currentMD), relativePath);
        }
      }).then(function () {
        return t.end();
      }).catch(function (err) {
        throw err;
      });
    });
  } else {
    (0, _processFiles2.default)({
      process: processMD,
      pattern: pattern,
      ignorePattern: ignorePattern,
      afterEachRender: function afterEachRender(opts) {
        if ((0, _normalizeNewline2.default)(opts.newMD) !== (0, _normalizeNewline2.default)(opts.currentMD)) {
          _fs2.default.writeFileSync(opts.filePath, opts.newMD, {
            encoding: 'utf8'
          });
          var relativePath = (0, _normalizePath2.default)(getRelativePath(opts.filePath));
          console.log('updated', highlightPath(relativePath));
        }
      }
    }).catch(function (err) {
      throw err;
    });
  }
}

function getRelativePath(filePath) {
  return (0, _relative2.default)(cwd, filePath);
}