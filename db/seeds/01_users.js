const bcrypt = require("bcryptjs");
const { admin_pass, admin_user } = require("../../config");

exports.seed = function(knex) {
  return knex("users").insert([
    {
      username: admin_user,
      password: bcrypt.hashSync(admin_pass, 12),
      type: "admin",
      postal_code: 76244
    },
    {
      username: "test1",
      password: bcrypt.hashSync("test1", 12),
      type: "user",
      postal_code: 75025,
      bio: "test bio 1"
    },
    {
      username: "test2",
      password: bcrypt.hashSync("test2", 12),
      type: "user",
      postal_code: 55555,
      address: "test address 2"
    },
    {
      username: "test3",
      password: bcrypt.hashSync("test3", 12),
      type: "user",
      postal_code: 'ABC DEF'
    }
  ]);
};
