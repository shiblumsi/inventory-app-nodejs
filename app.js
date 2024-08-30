const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")


dotenv.config()
const app = express()
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res)=>{
    res.json({status:'ok', message:"Welcome from dev."})
})


module.exports = app