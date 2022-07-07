const { app } = require('./app');

//Models
const { User } = require('./models/user.model');
const { Post } = require('./models/post.model');
const { Comment } = require('./models/comment.model');

//Utils
const { db } = require('./utils/database.util');
//Authenticate and sync the data base
db.authenticate()
  .then(() => console.log('database authenticated'))
  .catch((err) => console.log(err));

//Establish models relations
// 1 user <---> M post
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User);

//1User <-->M comments
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User);
//1post <-->M comments
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post);

db.sync()
  .then(() => console.log('database sync'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;

//listen de express se le pasa el puerto y un callback que se ejecuta cuando el servidor se ejecuta
app.listen(PORT, () => {
  console.log('express app running!');
});
