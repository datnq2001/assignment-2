const db = require("../models");
const Contacts = db.contacts;
const Phones = db.phones;
const Op = db.Sequelize.Op;


// Create a new contact
exports.create = (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).send({ message: "Name is required" });
  }

  // Create a new contact
  Contacts.create({ name })
    .then((contact) => {
      res.status(201).send(contact);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the contact.",
      });
    });
};

// Get all contacts
exports.findAll = (req, res) => {
  Contacts.findAll()
    .then((contacts) => {
      res.send(contacts);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving contacts.",
      });
    });
};

// Get a single contact by ID
exports.findOne = (req, res) => {
  const contactId = req.params.contactId;

  Contacts.findByPk(contactId)
    .then((contact) => {
      if (!contact) {
        return res.status(404).send({ message: "Contact not found" });
      }
      res.send(contact);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving the contact.",
      });
    });
};

// Update a contact by ID
exports.update = (req, res) => {
  const contactId = req.params.contactId;
  const { name } = req.body;

  Contacts.findByPk(contactId)
    .then((contact) => {
      if (!contact) {
        return res.status(404).send({ message: "Contact not found" });
      }

      contact.name = name;
      contact
        .save()
        .then(() => {
          res.send(contact);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while updating the contact.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving the contact.",
      });
    });
};

// Delete a contact by ID, and also delete associated phones
exports.delete = (req, res) => {
  const contactId = req.params.contactId;

  // First, find the contact by ID
  Contacts.findByPk(contactId)
    .then((contact) => {
      if (!contact) {
        return res.status(404).send({ message: "Contact not found" });
      }

      // Find all phones associated with the contact
      Phones.findAll({
        where: { contactId },
      })
        .then((phones) => {
          // Delete each phone
          const phoneDeletePromises = phones.map((phone) => {
            return phone.destroy();
          });

          // Use Promise.all to delete all phones
          Promise.all(phoneDeletePromises)
            .then(() => {
              // After deleting all phones, delete the contact
              contact
                .destroy()
                .then(() => {
                  res.send({ message: "Contact and associated phones were deleted successfully." });
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || "Some error occurred while deleting the contact.",
                  });
                });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Some error occurred while deleting associated phones.",
              });
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while retrieving associated phones.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting the contact.",
      });
    });
};

