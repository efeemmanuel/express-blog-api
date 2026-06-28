require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Role, Permission, User, Category } = require('../models');

const ROLES = ['admin', 'editor', 'user'];

const PERMISSIONS = [
  'create_post',
  'read_post',
  'update_post',
  'delete_post',
  'manage_users',
  'create_comment',
  'read_comment',
  'delete_comment',
];

const ROLE_PERMISSIONS = {
  admin: ['create_post', 'read_post', 'update_post', 'delete_post', 'manage_users', 'create_comment', 'read_comment', 'delete_comment'],
  editor: ['create_post', 'read_post', 'update_post', 'delete_post', 'create_comment', 'read_comment', 'delete_comment'],
  user: ['read_post', 'create_comment', 'delete_comment'],
};


const CATEGORIES = [
  'Politics',
  'Entertainment',
  'Technology',
  'Sports',
  'Health',
  'Business',
  'Science',
  'Education',
];



// const POSTS = Array.from({ length: 20 }).map((_, i) => ({
//   title: `Sample Post ${i + 1}`,
//   content: `This is the content for post ${i + 1}. It covers interesting insights about ${
//     CATEGORIES[i % CATEGORIES.length]
//   }.`,
//   coverImage: `https://picsum.photos/seed/post${i}/600/400`,
//   isFeatured: i % 5 === 0, // every 5th post is featured
//   status: i % 3 === 0 ? 'draft' : 'published',
// }));




const SUPER_ADMIN = {
  name: 'Super Admin',
  email: process.env.SUPER_ADMIN_EMAIL || 'admin@admin.com',
  password: process.env.SUPER_ADMIN_PASSWORD || 'admin123',
};

async function seed() {
  await sequelize.sync({ force: true });

  // add permission
  const permissions = await Permission.bulkCreate(
    PERMISSIONS.map((name) => ({ name })),
    { returning: true }
  );
  const permMap = Object.fromEntries(permissions.map((p) => [p.name, p]));


  // add category
  await Category.bulkCreate(
  CATEGORIES.map((name) => ({ name })),
  { returning: true }
  );

  console.log(`Seeded ${CATEGORIES.length} categories`);

  // add role
  let adminRole;
  for (const roleName of ROLES) {
    const role = await Role.create({ name: roleName });
    const perms = ROLE_PERMISSIONS[roleName].map((name) => permMap[name]);
    await role.addPermissions(perms);
    if (roleName === 'admin') adminRole = role;
  }

  // hash admin password
  const hashedPassword = await bcrypt.hash(SUPER_ADMIN.password, 10);
  const superAdmin = await User.create({
    name: SUPER_ADMIN.name,
    email: SUPER_ADMIN.email,
    password: hashedPassword,
  });

  // add admin to role
  await superAdmin.addRole(adminRole);

  console.log(`Seed complete. Super admin: ${SUPER_ADMIN.email}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});