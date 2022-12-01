
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./reso-hook.cjs.production.min.js')
} else {
  module.exports = require('./reso-hook.cjs.development.js')
}
