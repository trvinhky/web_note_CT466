const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require('./config/connectDB')

dotenv.config();

const app = express();
const port = process.env.PORT;

// Config app
app.use(cors());
app.use(express.json())
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.FEURL)

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
    next()
})

// Connect database
connectDB()

// Routes
const path = (name) => `/api/v2/${name}`
app.use(path('user'), require('./routes/user.route'))
app.use(path('work'), require('./routes/work.route'))
app.use(path('group'), require('./routes/group.route'))
app.use(path('groupInfo'), require('./routes/groupInfo.route'))
app.use(path('workInfo'), require('./routes/workInfo.route'))

app.listen(port, () => {
    console.log(`Server running on port ${port} (http://localhost:${port})`)
})
