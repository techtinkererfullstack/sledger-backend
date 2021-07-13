const express = require('express');
const mongoose = require('mongoose');
const sales = require('./router/sales');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost/s-ledger', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  })
  .then(()=>console.log('connected to mongo db...'))
  .catch(err=>console.error('could not connect to mongodb...1',err));

app.get('/', (req,res) => {
  res.send('full api..')
});

app.use('/api/sales', sales);

const port = process.env.PORT || 8080;
app.listen(port,
  () => console.log(`Listening onport ${port}...`));


