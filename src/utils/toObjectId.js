const { ObjectId } = require('bson');

const toObjectId = (id) => {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId format');
  }
  return "ObjectId(\""+id+"\")";
};

module.exports = {
  toObjectId,
};