const axios = require("axios");

const handleRun = async (req, res) => {
  try {
    const response = await axios.post(
      `http://localhost:${process.env.COMPILER_PORT}/run`,
      req.body
    );
    console.log("Run success status:",response?.data?.success);
    res.json(response.data);
  } catch (error) {
    console.log("Error occured inside handleRun:", error);
  }
};

module.exports = {
  handleRun,
};
