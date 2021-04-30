const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const express_uploadfile = require('express-fileupload')

require('dotenv').config()

const app = express()

const http = require('http').Server(app)
/* uncomment below code for use socket */
// require('./utils/socket.util').init(http)

app.use(express.json())
app.use(cors())
app.use(express_uploadfile())
app.use(express.static('public'))

/* config database */
const mongo_uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@backend.hn2id.mongodb.net/${process.env.MONGO_NAME}?retryWrites=true&w=majority`

mongoose
  .connect(mongo_uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB Connected!'))
  .catch(err => {
    console.log(err)
  });


/* use routes */
app.use('/api/v1', require('./routes'))

http.listen(process.env.PORT, () => console.log(`Server running or port ${process.env.PORT}`))