const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const User= require('../../models/User');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
          path: 'user', model: User
        })
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUser(_,{userId}){
      try{
        const user= await User.findById(userId);
        if(user){
          return user;
        }
        throw new Error("User not found");
      }
      catch(err){
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async updatePost(_,{postId,body},context){
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }
      let post=Post.findById(postId);

       if (!post) {
        throw new Error('Post not found');
      }
     post= Post.findOneAndUpdate(postId,{
        body,
        createdAt: new Date().toISOString()
      },{new:true});

     context.pubsub.publish('POST_UPDATED', {
        updatePost: post
      });
     return post;
    },

    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();
      const x=await User.findById(user.id);

      if(x){
        x.posts.push(post);
        await x.save();

      }

      context.pubsub.publish('NEW_POST', {
        newPost: post
      });

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Post already likes, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    },
    async deleteManyPosts(_,{username}){
     const x=await Post.deleteMany({username});
     return 'SUCCESS';
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    },
    updatePost:{
      subscribe(parent, { postId }, { pubsub }, info){
          const post = Post.findById(postId);

          if (!post) {
              throw new Error('Post not found')
          }

          return pubsub.asyncIterator(`POST_UPDATED`);
      }
    }
  }
};
