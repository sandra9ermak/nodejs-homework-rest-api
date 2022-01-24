const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../model/index");

router.use(cors());

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  return res.status(200).json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  try {
    return res.status(200).json(await getContactById(req.params.contactId));
  } catch {
    return res.status(404).json({ message: "Not found" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const result = await addContact(req.body);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: "missing required name field" });
    // return res.status(400).json({ message: `${err.message}` });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const result = await removeContact(req.params.contactId);
    res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    return res.status(404).json({ massage: "Contact not found" });
  }
});

router.patch("/:contactId", async (req, res, next) => {
  try {
    const contact = await updateContact(req.params.contactId, req.body);
    res.status(200).json(contact);
  } catch (err) {
    return res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
