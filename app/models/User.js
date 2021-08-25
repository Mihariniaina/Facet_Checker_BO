const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = Schema({
  //Unique id created automatically by the mongoose
  ip: { type: String, unique: true, required: true },
  numberOfRequest: { type: Number, required: true, default: 0 },
  validation: { type: Boolean, default: false },
  email: { type: String, default: null },
  password: { type: String, default: null },
  newsletter: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now() },
  connected: { type: Boolean, default: false },
  isrobot: { type: Boolean, default: false },
  same_frequency: { type: Number, default: 0 },
  frequency: { type: Number, default: 0 },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
