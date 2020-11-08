const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
var mongoose = require('mongoose');

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length
  },
  User:{
    posts:(parent)=>parent.populate('posts')
  },
  // User:{
  //   posts:(parent)=>{
  //     return parent.posts.map(i=>{
  //      return mongoose.Types.ObjectId(i);
  //     })
  //   }
  // },
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation
  },
  Subscription: {
    ...postsResolvers.Subscription,
    ...commentsResolvers.Subscription
  }
};
