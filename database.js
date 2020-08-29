const db = require("node-localdb");
const con = db("./dictionaries/Bad_People.json");

connection = {};

connection.add = async (data) => {
  try {
    return await con.insert(data);
  } catch (e) {
    console.log("error on saving a bad person");
  }
};

connection.update = async (authorId) => {
  try {
    const person = await connection.get(authorId);

    if (person) {
      person.threshold += 1;
      person.date = new Date();

      await connection.remove(authorId);
      await connection.add(person);
    }
  } catch (e) {
    console.log(e);
    console.log("error on update a record of a bad person");
  }
};

connection.remove = async (authorId = null) => {
  try {
    if (authorId) return await con.remove({ authorId });

    return await con.remove();
  } catch (e) {
    console.log("error on remove a record of a bad person");
  }
};

connection.get = async (authorId) => {
  try {
    return await con.findOne({ authorId });
  } catch (e) {
    console.log("error on getting one bad person");
  }
};

connection.all = async () => {
  try {
    return await con.find({});
  } catch (e) {
    console.log("error on getting all bad people");
  }
};

module.exports = connection;
