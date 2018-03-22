const layout = require('../layouts/layout.js')
const content = require('./diamondWinner3.ejs')
const pageTitle = 'Diamond Winner- Round 3'

module.exports = layout.init(pageTitle).run(content({ pageTitle }))
