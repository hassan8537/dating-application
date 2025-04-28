exports.timeToISODate = (timeStr) => {
  const now = new Date();
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");

  hours = parseInt(hours, 10);
  if (modifier.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  now.setUTCHours(hours);
  now.setUTCMinutes(parseInt(minutes, 10));
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
