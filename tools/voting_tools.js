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


const NONE = 'None'
const LOW_TO_HIGH = 'Low to High'
const HIGH_TO_LOW = 'High to Low'
const ALPHABETICAL = 'Alphabetical'

export const sortOptions = [NONE, LOW_TO_HIGH, HIGH_TO_LOW, ALPHABETICAL]

export function sortPollEntries(poll) {
  if (!poll) {
    return null
  }

  const { sortOrder, entries } = poll
  const noVotes = Boolean(entries.filter(current => current.votes.length > 0).length === 0)

  entries.sort((first, second) => {
    switch (noVotes ? NONE : sortOrder) {
      case LOW_TO_HIGH:
        return ((first.votes.length > second.votes.length) || (first.originalEntryIndex > second.originalEntryIndex))

      case HIGH_TO_LOW:
        return ((first.votes.length < second.votes.length) || (first.originalEntryIndex > second.originalEntryIndex))

      case ALPHABETICAL:
        return first.title > second.title

      case NONE:
      default:
        return first.originalEntryIndex > second.originalEntryIndex
    }
  })
  return poll
}
