const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  posts: [
  {
    type: Schema.Types.ObjectId,
    ref: 'post'
  }
]
});

module.exports = model('User', userSchema);
