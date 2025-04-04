export function calculateContactGoals(total) {
  if (!total) {
    return false
  }
  const totals = {
    week12: parseInt((total * 2.7) / 100, 10),
    week11: parseInt((total * 4.05) / 100, 10),
    week10: parseInt((total * 4.05) / 100, 10),
    week9: parseInt((total * 5.41) / 100, 10),
    week8: parseInt((total * 8.11) / 100, 10),
    week7: parseInt((total * 8.11) / 100, 10),
    week6: parseInt((total * 9.46) / 100, 10),
    week5: parseInt((total * 9.46) / 100, 10),
    week4: parseInt((total * 10.81) / 100, 10),
    week3: parseInt((total * 10.81) / 100, 10),
    week2: parseInt((total * 13.51) / 100, 10),
    week1: parseInt((total * 13.51) / 100, 10),
  }

  const totalGoals = {}
  Object.keys(totals).forEach((week) => {
    totalGoals[week] = {
      total: totals[week],
      doorKnocking: parseInt(totals[week] * 0.2),
      calls: parseInt(totals[week] * 0.35),
      digital: parseInt(totals[week] * 0.45),
    }
  })

  return totalGoals
}

export function calculateAccumulated(weeks, contactGoals) {
  let accumulatedTotal = {
    doorKnocking: 0,
    calls: 0,
    digital: 0,
  }
  if (weeks > 12) {
    return contactGoals.week12
  }
  for (let i = 0; i < 13 - weeks; i++) {
    const key = `week${12 - i}`
    accumulatedTotal.doorKnocking += contactGoals[key]?.doorKnocking || 0
    accumulatedTotal.calls += contactGoals[key]?.calls || 0
    accumulatedTotal.digital += contactGoals[key]?.digital || 0
  }

  return accumulatedTotal
}

export function calculateAccumulatedByWeek(contactGoals) {
  let accumulatedTotal = {
    week12: {
      doorKnocking: contactGoals.week12?.doorKnocking,
      calls: contactGoals.week12?.calls,
      digital: contactGoals.week12?.digital,
    },
    week11: {
      doorKnocking: 0,
      calls: 0,
      digital: 0,
    },
    week10: {
      doorKnocking: 0,
      calls: 0,
      digital: 0,
    },
    week9: {
      doorKnocking: 0,
      calls: 0,
      digital: 0,
    },
    week8: {
      doorKnocking: 0,
      calls: 0,
      digital: 0,
    },
    week7: {
      doorKnocking: 0,
      calls: 0,
      digital: 0,
    },
    week6: {
      doorKnocking: 0,
      calls: 0,
      digital: 0,
    },
    week5: {
      doorKnocking: 0,
      calls: 0,
      digital: 0,
    },
    week4: {
      doorKnocking: 0,
      calls: 0,
      digital: 0,
    },
    week3: {
      doorKnocking: 0,
      calls: 0,
      digital: 0,
    },
    week2: {
      doorKnocking: 0,
      calls: 0,
      digital: 0,
    },
    week1: {
      doorKnocking: 0,
      calls: 0,
      digital: 0,
    },
  }

  for (let i = 0; i < 11; i++) {
    const key = `week${11 - i}`
    const prevKey = `week${12 - i}`
    accumulatedTotal[key].doorKnocking =
      contactGoals[key].doorKnocking + accumulatedTotal[prevKey].doorKnocking
    accumulatedTotal[key].calls =
      contactGoals[key].calls + accumulatedTotal[prevKey].calls
    accumulatedTotal[key].digital =
      contactGoals[key].digital + accumulatedTotal[prevKey].digital
  }

  return accumulatedTotal
}

export const getVoterContactsGoal = ({ voterContactGoal, voteGoal }) =>
  parseInt(voterContactGoal ?? voteGoal * 5, 10)

export const getVoterContactsTotal = ({
  doorKnocking,
  calls,
  digital,
  directMail,
  digitalAds,
  text,
  events,
}) =>
  (doorKnocking || 0) +
  (calls || 0) +
  (digital || 0) +
  (directMail || 0) +
  (digitalAds || 0) +
  (text || 0) +
  (events || 0)

export const calculateVoterContactCounts = (
  pathToVictory,
  reportedVoterGoals,
) => {
  return {
    needed: getVoterContactsGoal(pathToVictory || {}),
    contacted: getVoterContactsTotal(reportedVoterGoals || {}),
  }
}
