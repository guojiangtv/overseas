const layout = require('../layouts/layout.js')
const content = require('./wangcai.ejs')
const pageTitle = '旺财来了！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
