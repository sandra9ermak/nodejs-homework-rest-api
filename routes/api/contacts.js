const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../model/index");

router.use(cors());

async function validatorError(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),

    phone: [Joi.string(), Joi.number()],

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });

  const { error } = schema.validate(req.body);
  if (!error) next();
  else next(error);
}

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  return res.json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  try {
    return res.json(await getContactById(req.params.contactId));
  } catch {
    return res.status;
    // res.json({ message: "template message" });
  }
});

// router.post("/", validatorError, async (req, res, next) => {
//   try {
//     return res.json(await addContact(req.body));
//   } catch (err) {
//     return res.status(400).json({ message: "missing required name field" });
//   }
// });
router.post("/", async (req, res, next) => {
  try {
    const result = await addContact(req.body);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: "missing required name field" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const result = await removeContact(req.params.contactId);
    res.status(200).json({ message: "Contact is deleted" });
  } catch (err) {
    return res.status(404).json({ massage: "Contact is not found" });
  }
});

router.patch("/:contactId", async (req, res, next) => {
  try {
    const contact = await updateContact(req.params.contactId, req.body);
    res.status(200).json(contact);
  } catch (err) {
    return res.status(404).json({ message: "Contact is not found" });
  }
});

module.exports = router;
