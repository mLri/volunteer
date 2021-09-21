const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const express_fileupload = require('express-fileupload')

require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(express_fileupload())
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

app.listen(process.env.PORT, () => console.log(`Server running or port ${process.env.PORT}`))