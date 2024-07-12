const axios = require("axios");

const handleRun = async (req, res) => {
  console.log("Received run request");
  console.log("Request body:", req.body);
  const response = await axios.post(
    `http://${process.env.COMPILER_IP}:${process.env.COMPILER_PORT}/run`,
    req.body
  );
  console.log("Response data:", response.data);
  res.json(response.data);
};

module.exports = {
  handleRun,
};
