
module.exports = {
  isAlreadyRunning: (alreadyRunEventIDs, eventID) => alreadyRunEventIDs.indexOf(eventID) >= 0,
  markAsRunning: (alreadyRunEventIDs, eventID) => alreadyRunEventIDs.push(eventID),
  markAsRunned: (alreadyRunEventIDs, eventID) => alreadyRunEventIDs.filter(item => item !== eventID)
}
