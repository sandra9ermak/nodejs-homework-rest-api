const errors = require("http-errors");

const {
  getUser: get,
  getUSerbyId: getById,
  addUser: add,
} = require("../model/users/index");

const getUser = async (req, res, next) => {
  try {
    console.log("ok");
    res.json(await get());
  } catch (err) {
    next(errors(400, err));
  }
};
