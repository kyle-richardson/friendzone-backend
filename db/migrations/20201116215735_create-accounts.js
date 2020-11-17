
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
        users.string("bio");
        users.string("address");
        users.string("postal_code").notNullable();
      })  
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema
      .dropTableIfExists("users");
  };
  