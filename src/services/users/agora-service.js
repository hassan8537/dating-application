const generateVoiceToken = require("../../utilities/generators/agora-token-generator");
const { handlers } = require("../../utilities/handlers/handlers");

class Service {
  constructor() {
    this.agoraAppId = process.env.AGORA_APP_ID;
    this.agoraAppCertificate = process.env.AGORA_APP_CERTIFICATE;
  }

  async getAgoraAccessToken(req, res) {
    try {
      const { channelName, uid, role } = req.body;

      if (!channelName || !uid)
        return handlers.response.failed({
          res,
          message: "channelName, uid and role are required"
        });

      const token = generateVoiceToken({
        channelName,
        role,
        uid: parseInt(uid, 10)
      });

      return handlers.response.success({
        res,
        message: "Success",
        data: {
          appId: this.agoraAppId,
          channelName,
          role,
          uid: parseInt(uid, 10),
          token
        }
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }
}

module.exports = new Service();
