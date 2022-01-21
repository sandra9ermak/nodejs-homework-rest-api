const fs = require("fs").promises;
const path = require("path");
const uniqid = require("uniqid");

const contactsPath = path.join(__dirname, "../db/contacts.json");

const listContacts = async () =>
  JSON.parse(await fs.readFile(contactsPath, "utf-8"));

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId);
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const postIndex = contacts.findIndex((item) => contactId === item.id);
  if (postIndex === -1) return false;
  contacts.splice(postIndex, 1);
  fs.writeFile(contactsPath, JSON.stringify(contacts));
  return true;
};

const addContact = async ({ name, email, phone }) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().required(),
    phone: Joi.required(),
  });
  // const data = await fs.readFile(contactsPath, "utf-8");
  // const contactList = JSON.parse(data);
  const contactList = await listContacts();
  const validationResult = schema.validate({ name, email, phone });
  if (validationResult.error) return false;
  const newContact = { id: uniqid(), name, email, phone };
  contactList.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(contactList));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const postIndex = contacts.findIndex((item) => contactId === item.id);
  const newContact = {
    ...contacts[postIndex],
    ...body,
    id: contacts[postIndex].id,
  };
  contacts.splice(postIndex, 1, newContact);
  fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
