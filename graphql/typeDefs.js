const { gql } = require('apollo-server');

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    user:User!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!,
    posts:[Post]!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getUser(userId:ID!):User
  }
  type Mutation {
    register(username: String!, email: String!,password: String!,confirmPassword: String! ): User!
    login(username: String!, password: String!): User!
    deleteUser(userId:ID!):String!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    updatePost(postId: ID!, body : String!):Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    deleteAll(username: String!):String!
  }
  type Subscription {
    newPost: Post!
    updatePost(postId: ID!): Post!
    comment(postId: ID!): CommentSubscriptionPayload!
  }

  enum Mutate_Enum{
    CREATED,
    UPDATED,
    DELETED
}
  type CommentSubscriptionPayload {
    mutation: Mutate_Enum!
    data: Post!
}
`;
//mongodb+srv://SUBHRA:eutsI6OrrAtXNyHo@cluster0.ompsv.mongodb.net/devconnector?retryWrites=true&w=majority