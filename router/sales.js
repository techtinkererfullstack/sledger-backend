const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

const Sale = mongoose.model('Sale'
  ,new mongoose.Schema({
    name: {
      type: String, 
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String, 
      enum: ['cash', 'credit'],
    }
}));

router.get('/',async (req, res)=>{
  const sales = await Sale.find();
  res.send(sales);
})

router.post('/',async (req, res) => {
  const {error} = validateSale(req.body);
  if(error) return res.status(404)
    .send(error.details[0].message); 

  let sale = new Sale({
    name: req.body.name,
    quantity: req.body.quantity,
    amount: req.body.amount,
    product: req.body.product,
    transactionType: req.body.transactionType,
  });

  sale = await sale.save();
  res.send(sale);

});

router.put('/:id', async (req, res) => {
  const {error} = validateSale(req.body);
    if(error) return res.status(404)
      .send(error.details[0].message);

  const sale = await Sale
    .findByIdAndUpdate(req.params.id, {
      name: req.body.name,             
      quantity: req.body.quantity,
      amount: req.body.amount,
      product: req.body.product,
      transactionType: req.body.transactionType,
      },
      { new: true})

  if (!sale) return res.status(404)
    .send("id not found...");

  res.send(sale);
});

router.delete('/:id', async (req, res) => {
  const sale =await Sale
    .findByIdAndDelete(req.param.id);

    if (!sale) return res.status(404)
      .send("id not found...");
      res.send(sale);
});

router.get('/:id', async (req, res) => {
    const sale =await Sale                         
    .findById(req.param.id);   
  if (!sale) return res.status(404)    
    .send("id not found...");           
      res.send(sale);                     
});

function validateSale(sale){
  const schema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().integer().required(),
    amount: Joi.number().integer().required(),
    product: Joi.string().required(),
    transactionType: Joi.string().required(),
  })
  
  return schema.validate(sale);
}

module.exports = router;


