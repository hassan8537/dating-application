const bcrypt = require("bcrypt");
const { handlers } = require("./handlers");

exports.comparePassword = async ({ plainPassword, hashedPassword, res }) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    handlers.logger.error({ message: error });
    return handlers.response.error({ res, message: error.message });
  }
};
