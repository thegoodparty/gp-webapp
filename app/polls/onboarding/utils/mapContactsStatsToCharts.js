/**
 * Maps contacts stats API data to chart format
 * @param {Object} contactsStats - The contacts stats data from the API
 * @returns {Object} Mapped data for charts
 */
export const mapContactsStatsToCharts = (contactsStats) => {
  if (!contactsStats || !contactsStats.categories) {
    return {
      totalConstituents: 0,
      ageDistribution: [],
      presenceOfChildren: [],
      homeowner: [],
      estimatedIncomeRange: [],
      education: []
    }
  }

  const { categories, meta } = contactsStats

  // Helpers to scale decimal fractions (0–1) to whole-number percentages (0–100)
  const toPercent = (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 0
    if (value <= 0) return 0
    // Preserve small non-zero values (e.g., 0.004 => 0.4%)
    return Number((value * 100).toFixed(1))
  }

  const finalizeBuckets = (consolidated) => {
    return Object.entries(consolidated)
      // Filter using raw value to ensure we keep small non-zero buckets
      .filter(([, raw]) => typeof raw === 'number' && raw > 0)
      .map(([name, raw]) => ({ name, value: toPercent(raw) }))
  }

  // Map age distribution - consolidate into 4 buckets like original
  const mapAgeDistribution = () => {
    if (!categories.age?.buckets) return []
    
    const buckets = categories.age.buckets
    const consolidated = {
      '18 - 25': 0,
      '25 - 35': 0,
      '35 - 50': 0,
      '50+': 0
    }
    
    buckets.forEach(bucket => {
      if (bucket.label === '18-25') consolidated['18 - 25'] += bucket.percent
      else if (bucket.label === '26-35') consolidated['25 - 35'] += bucket.percent
      else if (bucket.label === '36-50') consolidated['35 - 50'] += bucket.percent
      else if (bucket.label === '51-200') consolidated['50+'] += bucket.percent
    })
    
    return finalizeBuckets(consolidated)
  }

  // Map presence of children - keep same format as original
  const mapPresenceOfChildren = () => {
    if (!categories.presenceOfChildren?.buckets) return []
    
    const buckets = categories.presenceOfChildren.buckets
    const consolidated = {
      'Yes': 0,
      'No': 0,
      'Unknown': 0
    }
    
    buckets.forEach(bucket => {
      if (bucket.label === 'Yes') consolidated['Yes'] += bucket.percent
      else if (bucket.label === 'No') consolidated['No'] += bucket.percent
      else consolidated['Unknown'] += bucket.percent
    })
    
    return finalizeBuckets(consolidated)
  }

  // Map homeowner status - consolidate into 4 buckets like original
  const mapHomeowner = () => {
    if (!categories.homeowner?.buckets) return []
    
    const buckets = categories.homeowner.buckets
    const consolidated = {
      'Yes': 0,
      'Likely': 0,
      'No': 0,
      'Unknown': 0
    }
    
    buckets.forEach(bucket => {
      if (bucket.label === 'Yes') consolidated['Yes'] += bucket.percent
      else if (bucket.label === 'Likely') consolidated['Likely'] += bucket.percent
      else if (bucket.label === 'No') consolidated['No'] += bucket.percent
      else consolidated['Unknown'] += bucket.percent
    })
    
    return finalizeBuckets(consolidated)
  }

  // Map estimated income range - consolidate into 6 buckets like original
  const mapEstimatedIncomeRange = () => {
    if (!categories.estimatedIncomeRange?.buckets) return []
    
    const buckets = categories.estimatedIncomeRange.buckets
    const consolidated = {
      'Under $50K': 0,
      '$50K - $75K': 0,
      '$75K - $100K': 0,
      '$100K - $150K': 0,
      '$150K+': 0,
      'Unknown': 0
    }
    
    buckets.forEach(bucket => {
      if (['1k–15k', '15k–25k', '25k–35k', '35k–50k'].includes(bucket.label)) {
        consolidated['Under $50K'] += bucket.percent
      } else if (bucket.label === '50k–75k') {
        consolidated['$50K - $75K'] += bucket.percent
      } else if (bucket.label === '75k–100k') {
        consolidated['$75K - $100K'] += bucket.percent
      } else if (['100k–125k', '125k–150k'].includes(bucket.label)) {
        consolidated['$100K - $150K'] += bucket.percent
      } else if (['150k–175k', '175k–200k', '200k–250k', '250k+'].includes(bucket.label)) {
        consolidated['$150K+'] += bucket.percent
      } else if (bucket.label === 'Unknown') {
        consolidated['Unknown'] += bucket.percent
      }
    })
    
    return finalizeBuckets(consolidated)
  }

  // Map education - consolidate into 7 buckets like original
  const mapEducation = () => {
    if (!categories.education?.buckets) return []
    
    const buckets = categories.education.buckets
    const consolidated = {
      'None': 0,
      'High School Diploma': 0,
      'Technical School': 0,
      'Some College': 0,
      'College Degree': 0,
      'Graduate Degree': 0,
      'Unknown': 0
    }
    
    buckets.forEach(bucket => {
      if (bucket.label === 'None') consolidated['None'] += bucket.percent
      else if (bucket.label === 'High School Diploma') consolidated['High School Diploma'] += bucket.percent
      else if (bucket.label === 'Technical School') consolidated['Technical School'] += bucket.percent
      else if (bucket.label === 'Some College') consolidated['Some College'] += bucket.percent
      else if (bucket.label === 'College Degree') consolidated['College Degree'] += bucket.percent
      else if (bucket.label === 'Graduate Degree') consolidated['Graduate Degree'] += bucket.percent
      else consolidated['Unknown'] += bucket.percent
    })
    
    return finalizeBuckets(consolidated)
  }

  return {
    totalConstituents: meta?.totalConstituents || 0,
    ageDistribution: mapAgeDistribution(),
    presenceOfChildren: mapPresenceOfChildren(),
    homeowner: mapHomeowner(),
    estimatedIncomeRange: mapEstimatedIncomeRange(),
    education: mapEducation()
  }
}
