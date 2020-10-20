const { AuthenticationError, UserInputError } = require('apollo-server');

const checkAuth = require('../../util/check-auth');
const Post = require('../../models/Post');

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not empty'
          }
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });
        await post.save();
        context.pubsub.publish(`NEW_COMMENT`, {
            comment: {
                mutation: 'CREATED',
                data: post
            }
        })
        return post;
      } else throw new UserInputError('Post not found');
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
         //post.comments=[...post.comments.map(i=>i.username!==username)];
         //await post.save();
         //return post;
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);

        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();

          context.pubsub.publish(`NEW_COMMENT`, {
            comment: {
                mutation: 'DELETED',
                data: post
            }
        });

          return post;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    }
  },

  Subscription:{
   comment: {
      subscribe(parent, { postId }, { pubsub }, info){
          const post = Post.findById(postId);

          if (!post) {
              throw new Error('Post not found')
          }

          return pubsub.asyncIterator(`NEW_COMMENT`)
      }
    }
  }
};
