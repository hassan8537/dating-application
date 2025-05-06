exports.timeToISODate = (timeStr) => {
  if (!timeStr) {
    return null;
  }

  const now = new Date();
  const parts = timeStr.trim().split(" ");

  if (parts.length !== 2) {
    return null; // Invalid format
  }

  const [time, modifier] = parts;
  let [hours, minutes] = time.split(":");

  if (!hours || !minutes || !modifier) {
    return null; // Missing expected components
  }

  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (isNaN(hours) || isNaN(minutes)) {
    return null;
  }

  const upperModifier = modifier.toUpperCase();
  if (upperModifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (upperModifier === "AM" && hours === 12) {
    hours = 0;
  }

  now.setUTCHours(hours);
  now.setUTCMinutes(minutes);
  now.setUTCSeconds(0);
  now.setUTCMilliseconds(0);

  return now.toISOString();
};

exports.isoDateToTime = (isoDateStr) => {
  const date = new Date(isoDateStr);

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const modifier = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // convert 0 to 12
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${hours}:${formattedMinutes} ${modifier}`;
};
