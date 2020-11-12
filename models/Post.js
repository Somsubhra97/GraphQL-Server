const { model, Schema } = require('mongoose');
const mongoose = require('mongoose');

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      post:mongoose.Schema.ObjectId,
      body: String,
      username: String,
      createdAt: String
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = model('Post', postSchema);
