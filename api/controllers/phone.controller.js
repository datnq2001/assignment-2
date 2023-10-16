const db = require("../models");
const Phones = db.phones;
const Contacts = db.contacts;
const Op = db.Sequelize.Op;

exports.findAllPhones = (req, res) => {
    Phones.findAll()
      .then((phones) => {
        res.send(phones);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving phones.",
        });
      });
  };
  
// Create a new phone for a contact
exports.create = (req, res) => {
  const contactId = req.params.contactId;
  const { name, phoneNumber } = req.body;

  // Validate input
  if (!name || !phoneNumber) {
    return res.status(400).send({ message: "Name and phoneNumber are required" });
  }

  Phones.create({ name, phoneNumber, contactId })
    .then((phone) => {
      res.status(201).send(phone);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the phone.",
      });
    });
};

// Get all phones for a contact
exports.findAll = (req, res) => {
  const contactId = req.params.contactId;

  Phones.findAll({
    where: { contactId },
  })
    .then((phones) => {
      res.send(phones);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving phones.",
      });
    });
};

// Get a single phone by ID
exports.findOne = (req, res) => {
  const contactId = req.params.contactId;
  const phoneId = req.params.phoneId;

  Phones.findOne({
    where: { id: phoneId, contactId },
  })
    .then((phone) => {
      if (!phone) {
        return res.status(404).send({ message: "Phone not found" });
      }
      res.send(phone);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving the phone.",
      });
    });
};

// Update a phone by ID
exports.update = (req, res) => {
  const contactId = req.params.contactId;
  const phoneId = req.params.phoneId;
  const { name, phoneNumber } = req.body;

  Phones.findOne({
    where: { id: phoneId, contactId },
  })
    .then((phone) => {
      if (!phone) {
        return res.status(404).send({ message: "Phone not found" });
      }

      phone.name = name;
      phone.phoneNumber = phoneNumber;
      phone
        .save()
        .then(() => {
          res.send(phone);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while updating the phone.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving the phone.",
      });
    });
};

// Delete a phone by ID
exports.delete = (req, res) => {
  const contactId = req.params.contactId;
  const phoneId = req.params.phoneId;

  Phones.destroy({
    where: { id: phoneId, contactId },
  })
    .then((num) => {
      if (num === 1) {
        res.send({ message: "Phone was deleted successfully." });
      } else {
        res.status(404).send({ message: "Phone not found" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting the phone.",
      });
    });
};
