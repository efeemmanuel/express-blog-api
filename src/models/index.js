const sequelize = require('../config/database');
const User = require('./user.model');
const Role = require('./role.model');
const Permission = require('./permission.model');
const Post = require('./post.model');
const Comment = require('./comment.model')
const Category = require('./category.model');




// The HasOne association
// The BelongsTo association
// The HasMany association
// The BelongsToMany association


// User <-> Role (many-to-many)
User.belongsToMany(Role, { through: 'user_roles', foreignKey: 'user_id' });
Role.belongsToMany(User, { through: 'user_roles', foreignKey: 'role_id' });

// Role <-> Permission (many-to-many)
Role.belongsToMany(Permission, { through: 'role_permissions', foreignKey: 'role_id' });
Permission.belongsToMany(Role, { through: 'role_permissions', foreignKey: 'permission_id' });

// Post -> User (author)
Post.belongsTo(User, { as: 'author', foreignKey: 'author_id' });
User.hasMany(Post, { as: 'posts', foreignKey: 'author_id' });



// Comment - post 
Post.hasMany(Comment, { as: 'comments', foreignKey: 'post_id' });
Comment.belongsTo(Post, { as: 'post', foreignKey: 'post_id' });


// Comment -> User (author)
Comment.belongsTo(User, { as: 'author', foreignKey: 'author_id' });
User.hasMany(Comment, { as: 'comments', foreignKey: 'author_id' });

// hasMany — "a Post has many comments" → as: 'comments'
// belongsTo — "a Comment belongs to a post" → as: 'post'
// The foreignKey is always post_id on both sides because it's the same column in the comments table.



// Post <-> Category (many-to-many)
Post.belongsToMany(Category, { through: 'post_categories', foreignKey: 'post_id', as: 'categories' });
Category.belongsToMany(Post, { through: 'post_categories', foreignKey: 'category_id', as: 'posts' });

module.exports = { sequelize, User, Role, Permission, Post, Comment, Category };