export default (function votingTools() {
  function voteOnPollEntries(voterID, entryTitle, entries) {
    const lastVotedOnEntry = getVotedOnEntryByVoter(voterID, entries)
    if (lastVotedOnEntry) {
      const votedOnEntry = getEntryByTitle(entryTitle, entries)

      lastVotedOnEntry.votes = lastVotedOnEntry.votes.filter(vote => vote !== voterID)
      if (votedOnEntry !== lastVotedOnEntry) {
        votedOnEntry.votes.push(voterID)
      }
    } else {
      getEntryByTitle(entryTitle, entries).votes.push(voterID)
    }
  }


  function getVotedOnEntryByVoter(voterID, entries) {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      if (entry.votes.includes(voterID)) {
        return entry
      }
    }

    return null
  }


  function getEntryByTitle(entryTitle, entries) {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      if (entry.title === entryTitle) {
        return entry
      }
    }

    return null
  }

  return {
    voteOnPollEntries
  }
}())
