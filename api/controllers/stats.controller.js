const db = require("../models");
const Phones = db.phones;
const Contacts = db.contacts;
const Op = db.Sequelize.Op;

// Calculate statistics
exports.calculate = (req, res) => {
  // Example: Calculate the number of contacts and phones
  Contacts.count()
    .then((contactCount) => {
      Phones.count()
        .then((phoneCount) => {
          res.send({
            contactCount,
            phoneCount,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while calculating phone statistics.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while calculating contact statistics.",
      });
    });
};
