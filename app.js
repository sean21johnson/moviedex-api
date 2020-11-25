require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const movies = require('./movies')

const app = express()

app.use(morgan('common'))
app.use(helmet())
app.use(cors())


app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})


function handleGetMovies(req, res) {
    let movieList = movies;

    const {genre, country, avg_vote} = req.query;
    
    if(genre) {
        movieList = movieList.filter(movie =>
            movie.
                genre.
                toLowerCase()
                .includes(genre.toLowerCase())
        )
    }

    if(country) {
        movieList = movieList.filter(movie => 
            movie.
                country.
                toLowerCase()
                .includes(country.toLowerCase())
        )
    }
    
    
    if(avg_vote) {
        movieList = movieList.filter(movie => 
            Number(movie.avg_vote) >= Number(avg_vote)
        )
    }
    

    res.json(movieList)
}


app.get('/movie', handleGetMovies) 


const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})