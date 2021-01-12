const bcrypt = require("bcryptjs");
const { admin_pass, admin_user } = require("../../config");

exports.seed = function(knex) {
  return knex("users").insert([
    {
      username: admin_user,
      password: bcrypt.hashSync(admin_pass, 12),
      type: "admin",
      postal_code: 76244,
      first_name: "admin",
      birthdate: "2018-06-15",
      gender: "male",
      looking_for:"male"
    },
    {
      username: "test1",
      password: bcrypt.hashSync("test1", 12),
      type: "user",
      postal_code: 75025,
      bio: "test bio 1",
      first_name: "test1",
      last_name: "lastName",
      birthdate: "1988-02-01",
      gender: "female",
      looking_for: "female"
    },
    {
      username: "test2",
      password: bcrypt.hashSync("test2", 12),
      type: "user",
      postal_code: 55555,
      address: "test address 2",
      first_name: "test2",
      birthdate: "2000-06-15",
      gender:"male",
      looking_for: "female"
    },
    {
      username: "test3",
      password: bcrypt.hashSync("test3", 12),
      type: "user",
      postal_code: 'ABC DEF',
      first_name: "test3",
      birthdate: "2008-12-04",
      gender: "female",
      looking_for: "male"
    }
  ]);
};
