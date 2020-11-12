const { model, Schema } = require('mongoose');
const mongoose = require('mongoose');
const {Post}=require('./Post')

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  posts: [
  {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  }
]
});

module.exports = model('User', userSchema);
