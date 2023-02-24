const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const minify = require('express-minify-html-2')
require('dotenv').config()

// Settings
const app = express()
app.set('port', process.env.PORT || 3000)
app.set('views', __dirname)
app.set('view engine', 'ejs')
const minifyOptions = {
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true,
  },
}

// Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(minify(minifyOptions))

// Routes
app.use('/api', require('./routes'))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Handler erros
app.use((req, res) => {
  res.render('app')
})

// Server listener
app.listen(app.get('port'), () => {
  console.log(`Listener in: http://localhost:${app.get('port')}/`)
})
