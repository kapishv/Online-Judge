const axios = require("axios");

const handleRun = async (req, res) => {
  const response = await axios.post(
    `http://localhost:${process.env.COMPILER_PORT}/run`,
    req.body
  );
  res.json(response.data);
};

module.exports = {
  handleRun,
};
