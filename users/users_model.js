const db = require("../db/knex");


module.exports = {
  getUsers,
  getAllUserInfo,
  findBy,
  add,
  remove,
  update,
  findRandom
};

// function checkForNullType(item) {
//   if (item.type === null) {
//     return {
//       ...item,
//       type: "user"
//     };
//   }
//   return item;
// }

function getUsers() {
  return db("users")
}

function getAllUserInfo(username) {
  return db("users")
    .where("users.username", username)
    .first();
}

function findBy(filter) {
  return db("users")
    .where(filter)
    .first();
}

function add(user) {
  return db("users")
    .insert(user, "id")
    .then(ids => {
      const [id] = ids;
      return findBy({ id });
    });
  // .then(ele => checkForNullType(ele));
}

async function remove(userId) {
  const userToDelete = await findBy({ id: userId });
  return await db("users")
    .where("users.id", userId)
    .del()
    .then(prom => {
      if (prom === 1) return userToDelete;
      else return prom;
    });
}

function update(id, changes) {
  return db("users")
    .where("users.id", id)
    .update(changes)
    .then(prom => {
      if (prom > 0) return findBy({ id });
      else return prom;
    });
}

function findRandom(currUser = 1) { //todo: check random result against current user
  return db.raw("SELECT RANDOM() * (SELECT MAX(id) FROM users)")
    .then(user => user)
}
