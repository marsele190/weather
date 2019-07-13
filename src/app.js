const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
//Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Dmytro Kostiuk'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Dmytro Kostiuk'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        name: 'Dmytro Kostiuk',
        helpMessage: 'Help Message'
    })
})

app.get('/weather', (req, res)=>{
    if (!req.query.address) {
        return res.send({
            error: 'No address provided!'
        })

    } 
 
    geocode (req.query.address, (error, {latitude, longitude, location} = {})=>{
        if (error) {
            return res.send({ error }) 
        }

        forecast (latitude, longitude, (error, forecastResponse)=>{
            if (error) {
                return res.send({ error })
            }

            res.send({
                address: req.query.address,
                forecast: forecastResponse,
                location
            })
        })
    })
})

app.get('/help/*',(req, res) => {
    res.render('404',{
        title:'404',
        name: 'Dmytro Kostiuk',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res)=>{
    res.render('404',{
        title: '404 Error',
        name: 'Dmytro Kostiuk',
        errorMessage: 'Page not found'
    })
})

app.listen(3000, ()=>{
    console.log('Server is running at port 3000')
})