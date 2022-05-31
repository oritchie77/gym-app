const express = require('express')
const app = express()
const port = 3001
const mysql = require('promise-mysql')
const {query} = require("express");
const cors = require('cors');

app.use(cors());

const dbConnection = async () => {
    return mysql.createConnection({

        user: 'root',
        password: 'password',
        database: 'gym-app'
    });
}


app.get('/', async (req, res) => {

    const connection = await dbConnection()
    let jsonData = await connection.query('SELECT * FROM `equipment`')
    if (req.query.id){
        let urlId = req.query.id
        jsonData = jsonData.filter((equipment) => urlId == equipment.id)
    }

    res.json(jsonData)

})
app.use(express.json())
app.post('/', async (req, res) => {

    const connection = await dbConnection()
    const name = req.body.name
    const units = req.body.units
    const pb = req.body.pb
    const query = 'INSERT INTO `equipment`(`name`, `units`, `pb`) VALUES ("' + name + '", "'+ units +'", ' + pb + ' )'

    connection.query(query)
    res.json({
        status: 200,
        message: 'new equipment added',
        data: req.body
    })
})

app.post('/update', async (req, res) => {

    const connection = await dbConnection()
    const pb = req.body.pb
    const urlId = req.query.id

    const query = 'UPDATE `equipment` SET `pb` = ' + pb + ' WHERE `id` = "' + urlId + '" '

    connection.query(query)
    res.json({
        status: 200,
        message: 'equipment updated',
        data: req.body
    })

})
app.listen(port)