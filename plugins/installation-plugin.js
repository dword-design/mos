'use strict'
module.exports = createPlugin

const readPkgUp = require('read-pkg-up')

function createPlugin (opts) {
  return readPkgUp({cwd: opts.filePath})
    .then((result) => {
      const pkg = result.pkg

      return Promise.resolve({
        installation () {
          return [
            '## Installation',
            '',
            'This module is installed via npm:',
            '',
            '``` sh',
            `npm install ${pkg.name} ${pkg.preferGlobal ? '--global' : '--save'}`,
            '```',
          ].join('\n')
        },
      })
    })
}
