
exports.up = function(knex) {
    return knex.schema
      .createTable("users", users => {
        users.increments("id");
        users
          .string("username")
          .notNullable()
          .unique();
        users.string("password").notNullable();
        users.string("type").defaultTo("user");
        users.date("birthdate").notNullable();
        users.string("first_name").notNullable();
        users.string("last_name");
        users.binary("photo");
        users.string("bio");
        users.string("address");
        users.string("postal_code").notNullable();
        users.string("gender").notNullable();
        users.string("looking_for").notNullable();
        users.specificType('swipe_right', 'integer ARRAY');
        users.specificType('swipe_left', 'integer ARRAY');
      })  
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema
      .dropTableIfExists("users");
  };
  