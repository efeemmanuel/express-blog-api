require('dotenv').config();
const { sequelize, Role, Permission } = require('../models');

// roles array
const ROLES = ['admin', 'editor', 'user'];
// const ROLES = ['admin', ,'user'];


// permisson array
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


// The Relationship Map
const ROLE_PERMISSIONS = {
  admin: ['create_post', 'read_post', 'update_post', 'delete_post', 'manage_users', 'create_comment', 'read_comment', 'delete_comment'],
  // user: ['create_post', 'read_post', 'update_post', 'create_comment', 'read_comment', 'delete_comment'],
  editor: ['create_post', 'read_post', 'update_post', 'delete_post','create_comment', 'read_comment', 'delete_comment'],
  user: ['read_post', 'create_comment', 'delete_comment'],
};


// seed function
async function seed() {

    //wipes and recreates all the tables before any data is inserted 
  await sequelize.sync({ force: true });


//  add the PERMISSON array to the Permission model
  const permissions = await Permission.bulkCreate(
    PERMISSIONS.map((name) => ({ name })),
    { returning: true }
  );

//   converts permissions to key-value pair
  const permMap = Object.fromEntries(permissions.map((p) => [p.name, p]));

//   loop through roles
  for (const roleName of ROLES) {
    // creates the role in DB
    const role = await Role.create({ name: roleName });
    // looks up which permissions this role should have from ROLE_PERMISSIONS map
    const perms = ROLE_PERMISSIONS[roleName].map((name) => permMap[name]);
    // links those permissions to the role in the junction table
    await role.addPermissions(perms);
  }

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});





// So perms is just saying:

// "For this role (e.g. admin), go to ROLE_PERMISSIONS, get its permission names, then look each one up in permMap to get the full permission object from the DB"

// Then addPermissions() is a Sequelize method that comes from the many-to-many association you defined earlier — it inserts the links into the role_permissions junction table automatically.