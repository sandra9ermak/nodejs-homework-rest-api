const express = require("express");
const router = express.Router();
const {
  contacts,
  contactById,
  remove,
  add,
  update,
  updateStatusContact,
} = require("../../controllers/contacts");

router.get("/", contacts);

router.get("/:contactId", contactById);

router.post("/", add);

router.delete("/:contactId", remove);

router.patch("/:contactId", update);

router.patch("/:contactId/favorite", updateStatusContact);

module.exports = router;
