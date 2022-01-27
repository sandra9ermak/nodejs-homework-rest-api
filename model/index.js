const Contacts = require("./schema");

const listContacts = async () => Contacts.find();

const getContactById = async (contactId) => Contacts.findById(contactId);

const removeContact = async (contactId) =>
  Contacts.deleteOne({ _id: contactId });

const addContact = async ({ name, email, phone }) => {
  await Contacts.create({ name, email, phone });
};

const updateContact = async (contactId, body) =>
  Contacts.updateOne({ _id: contactId }, body);

const updateStatusContact = async (contactId, body) =>
  Contacts.updateOne({ _id: contactId }, body);

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
