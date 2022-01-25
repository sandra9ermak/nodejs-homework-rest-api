const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../model/index");

const contacts = async (req, res, next) => {
  const contacts = await listContacts();
  return res.status(200).json(contacts);
};

const contactById = async (req, res, next) => {
  try {
    return res.status(200).json(await getContactById(req.params.contactId));
  } catch {
    return res.status(404).json({ message: "Not found" });
  }
};

const add = async (req, res, next) => {
  try {
    const result = await addContact(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: "missing required name field" });
    // return res.status(400).json({ message: `${err.message}` });
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await removeContact(req.params.contactId);
    res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    return res.status(404).json({ massage: "Contact not found" });
  }
};

const update = async (req, res, next) => {
  try {
    const contact = await updateContact(req.params.contactId, req.body);
    res.status(200).json(contact);
  } catch (err) {
    return res.status(404).json({ message: "Not found" });
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    await updateStatusContact(req.params.id, req.body);
    if (!req.body)
      return res.status(400).json({ message: "missing field favorite" });
    else
      return res
        .status(200)
        .json(await updateStatusContact(req.params.id, req.body));
  } catch (err) {
    next(errors(404, err));
  }
};

module.exports = {
  contacts,
  contactById,
  remove,
  update,
  add,
  updateStatusContact,
};
