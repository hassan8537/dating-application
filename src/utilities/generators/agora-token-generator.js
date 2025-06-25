const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

const generateCallToken = ({
  channelName,
  uid,
  role = "publisher",
  expireTime = 3600
}) => {
  if (!APP_ID || !APP_CERTIFICATE) {
    throw new Error("Agora credentials not set");
  }

  const agoraRole =
    role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    agoraRole,
    privilegeExpireTime
  );

  return token;
};

module.exports = generateCallToken;
