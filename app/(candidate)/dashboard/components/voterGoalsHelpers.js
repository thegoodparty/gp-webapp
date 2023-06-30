export function calculateContactGoals(total, weeksUntil) {
  if (!total || !weeksUntil) {
    return false;
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
  };

  const totalGoals = {};
  Object.keys(totals).forEach((week) => {
    totalGoals[week] = {
      total: totals[week],
      doorKnocking: parseInt(totals[week] * 0.2),
      calls: parseInt(totals[week] * 0.35),
      digital: parseInt(totals[week] * 0.45),
    };
  });

  return totalGoals;
}

export function calculateAccumulated(weeks, contactGoals) {
  let accumulatedTotal = {
    doorKnocking: 0,
    calls: 0,
    digital: 0,
  };
  if (weeks > 12) {
    return contactGoals.week12;
  }
  for (let i = 0; i < 13 - weeks; i++) {
    const key = `week${12 - i}`;
    accumulatedTotal.doorKnocking += contactGoals[key].doorKnocking;
    accumulatedTotal.calls += contactGoals[key].calls;
    accumulatedTotal.digital += contactGoals[key].digital;
  }

  return accumulatedTotal;
}
