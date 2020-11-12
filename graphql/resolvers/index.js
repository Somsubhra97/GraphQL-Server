const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
var mongoose = require('mongoose');

const Post = require('../../models/Post');

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
    user:parent=>parent.populate('user').execPopulate().then(x=>x.user)
  },
  User:{
    posts:(parent)=>parent.populate('posts').execPopulate().then(x=>x.posts)
    },
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
