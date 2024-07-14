const axios = require("axios");

const handleRun = async (req, res) => {
  console.log("\x1b[33mReceived run request\x1b[0m"); // Yellow for Received run request
  console.log("\x1b[36mRequest body:\x1b[0m", req.body); // Cyan for Request body
  const response = await axios.post(
    `http://${process.env.COMPILER_SOCKET}/run`,
    req.body
  );
  console.log("\x1b[36mResponse data:\x1b[0m", response.data); // Cyan for Response data
  res.json(response.data);
};

module.exports = {
  handleRun,
};
