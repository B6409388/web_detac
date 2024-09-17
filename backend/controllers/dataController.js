const Data = require("../models/schema.js").DataLicent;

exports.createData = async (req, res) => {
  try {
    const data = new Data(req.body);

    const newData = await data.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
