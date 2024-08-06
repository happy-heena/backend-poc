import mongoose from 'mongoose';

const { Schema } = mongoose;

const CurrencySchema = new Schema({
  code: String,
  name: String,
  country: String,
});

const Currency = mongoose.model('Currency', CurrencySchema);
export default Currency;
