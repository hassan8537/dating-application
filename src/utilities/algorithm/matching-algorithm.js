function getDistanceInMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of Earth in miles
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateMatchScore(userA, userB) {
  let score = 0;

  // Age (10%)
  if (userA.age && userB.age) {
    const ageDiff = Math.abs(Number(userA.age) - Number(userB.age));
    if (ageDiff <= 3) score += 10;
    else if (ageDiff <= 7) score += 5;
  }

  // Gender (15%)
  if (userA.gender && userB.gender && userA.gender === userB.gender) {
    score += 15;
  }

  // Location proximity (15%)
  if (
    userA.location?.coordinates?.length === 2 &&
    userB.location?.coordinates?.length === 2
  ) {
    const [lon1, lat1] = userA.location.coordinates;
    const [lon2, lat2] = userB.location.coordinates;
    const distance = getDistanceInMiles(lat1, lon1, lat2, lon2);
    if (distance <= 25) score += 15;
    else if (distance <= 50) score += 10;
    else if (distance <= 100) score += 5;
  }

  // Interests & Hobbies (20%)
  const commonInterests =
    userA.interests?.filter((i) => userB.interests?.includes(i)) || [];
  const commonHobbies =
    userA.hobbies?.filter((h) => userB.hobbies?.includes(h)) || [];
  const totalInterestHobbyMatch = new Set([
    ...commonInterests,
    ...commonHobbies
  ]).size;
  const total = (userA.interests?.length || 0) + (userA.hobbies?.length || 0);
  if (total > 0) {
    score += (totalInterestHobbyMatch / total) * 20;
  }

  // Relationship Status (10%)
  if (
    userA.relationship &&
    userB.relationship &&
    userA.relationship === userB.relationship
  ) {
    score += 10;
  }

  // Feelings & Professions (10%)
  let feelingMatch = 0;
  if (userA.feelings && userB.feelings && userA.feelings === userB.feelings)
    feelingMatch += 5;

  const commonProfessions =
    userA.professions?.filter((p) => userB.professions?.includes(p)) || [];
  if (commonProfessions.length > 0) feelingMatch += 5;
  score += feelingMatch;

  // Profile Completion (10%)
  if (userA.isProfileCompleted && userB.isProfileCompleted) score += 10;
  else if (userA.isProfileCompleted || userB.isProfileCompleted) score += 5;

  // Preferences (10%) — Matching interests + hobbies + professions
  const preferenceMatchCount = new Set([
    ...(userA.interests?.filter((i) => userB.interests?.includes(i)) || []),
    ...(userA.hobbies?.filter((h) => userB.hobbies?.includes(h)) || []),
    ...(userA.professions?.filter((p) => userB.professions?.includes(p)) || [])
  ]).size;

  const totalPrefs =
    (userA.interests?.length || 0) +
    (userA.hobbies?.length || 0) +
    (userA.professions?.length || 0);
  if (totalPrefs > 0) score += (preferenceMatchCount / totalPrefs) * 10;

  return Number(score.toFixed(2)); // Final score rounded to 2 decimal places
}

module.exports = { calculateMatchScore };
