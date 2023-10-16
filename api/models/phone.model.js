module.exports = (sequelize, Sequelize) => {
    const Phone = sequelize.define("phone", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
    });
  
    return Phone;
  };
  