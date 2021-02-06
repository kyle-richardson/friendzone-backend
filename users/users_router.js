const router = require("express").Router();
const bcrypt = require("bcryptjs");
const UsersDb = require("./users_model");
const {
  restrictedUser,
  adminOnly,
  isSignedIn
} = require("../auth/auth_middleware");

router.get("/", adminOnly, async (req, res) => {
  try {
    const users = await UsersDb.getUsers();
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "could not retrieve users", error: err.message });
  }
});

router.get('/random', async (req, res)=> {
  try {
    const randUser = await UsersDb.findRandom()
    res.status(200).json(randUser.rows[0])
  }
  catch (err ) {
    res
        .status(500)
        .json({ message: "could not find new user", error: err.message });
  }
})

router.get("/:id", restrictedUser, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UsersDb.findBy({ id });
    res.status(200).json({ ...user})
  } catch (err) {
    res.status(500).json({
      message: "could not retrieve user at specified id",
      error: err.message
    });
  }
});

router.post("/register", verifyNewUser, async (req, res) => {
  const userInfo = req.body;
  try {
    const newUser = await UsersDb.add({
      ...userInfo,
      password: bcrypt.hashSync(userInfo.password, 12),
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "could not add user", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userInfo = await UsersDb.getAllUserInfo(username);
    if (userInfo && bcrypt.compareSync(password, userInfo.password)) {
      // req.session.user = userInfo; //creates session
      // console.log(req.session.user)
      const user = await UsersDb.findBy({ id: userInfo.id });
      res.status(200).json({
        message: "welcome",
        ...user,
        isLoggedIn: true
      });
    } else {
      res
        .status(401)
        .json({ message: "Invalid Credentials", isLoggedIn: false });
    }
  } catch (err) {
    res.status(500).json({
      message: "failed to sign in",
      error: err.message,
      isLoggedIn: false
    });
  }
});

router.post("/logout", isSignedIn, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(400).json({ message: "could not logout", error: err.message });
    } else
      res.status(200).json({ message: `Logout success`, isLoggedIn: false });
  });
});

router.delete("/:id", restrictedUser, (req, res) => {
  const { id } = req.params;
  UsersDb.remove(id)
    .then(deletedUser => {
      if (deletedUser !== 0) res.status(200).json(deletedUser);
      else
        res.status(400).json({
          message: "User not found or already deleted at specified id"
        });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "could not delete user", error: err.message });
    });
});

router.put("/:id", restrictedUser, verifyChanges, async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    let updatedUser;
    if (password) {
      const newPass = bcrypt.hashSync(password, 12);
      updatedUser = await UsersDb.update(id, {
        username: username,
        password: newPass
      });
    } else updatedUser = await UsersDb.update(id, { username: username });
    res.status(200).json(updatedUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "could not update user info", error: err.message });
  }
});




function verifyChanges(req, res, next) {
  const changes = req.body;
  if (changes.username) next();
  else
    res.status(400).json({
      message:
        "username field required to make changes (even if it is not changed)"
    });
}

function verifyNewUser(req, res, next) {
  const { username, password } = req.body;
  if (username && password) {
    UsersDb.findBy({ username }).then(user => {
      if (user) res.status(400).json({ message: "username already in use" });
      else next();
    });
  } else
    res.status(400).json({ message: "username and password fields required" });
}

module.exports = router;
