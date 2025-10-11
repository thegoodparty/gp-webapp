export const polls = [
  {
    id: 1,
    name: 'Top community issues 1',
    status: 'in_progress',
    imageUrl: 'https://assets.goodparty.org/candidates/ali--dieng-29ottg.jpeg',
    scheduledDate: '2025-01-01',
    completedDate: '2025-01-01',
    lowConfidence: false,
    audienceSize: 1200,
    messageContent:
      "Hi, I'm Grand Rapids City Council Member Benjamin Schmitt. What local issues matter most to you? I'd genuinely value your input. Reply to share or text STOP to opt out.",
    cost: 0,
  },
  {
    id: 2,
    name: 'Top community issues 2',
    status: 'scheduled',
    imageUrl: 'https://assets.goodparty.org/candidates/ali--dieng-29ottg.jpeg',
    scheduledDate: '2025-01-01',
    completedDate: '2025-01-01',
    lowConfidence: false,
    audienceSize: 100,
    messageContent:
      "Hi, I'm Grand Rapids City Council Member Benjamin Schmitt. What local issues matter most to you? I'd genuinely value your input. Reply to share or text STOP to opt out.",
    cost: 0,
  },
  {
    id: 3,
    name: 'Top community issues 3',
    status: 'completed',
    imageUrl: 'https://assets.goodparty.org/candidates/ali--dieng-29ottg.jpeg',
    scheduledDate: '2025-01-01',
    completedDate: '2025-01-01',
    lowConfidence: false,
    audienceSize: 100,
    actions: 'Gather more feedback',
    responses: 100,
    messageContent:
      "Hi, I'm Grand Rapids City Council Member Benjamin Schmitt. What local issues matter most to you? I'd genuinely value your input. Reply to share or text STOP to opt out.",
  },
]

export const pollIssues = [
  {
    id: 1,
    title: 'Traffic Congestion and Safety',
    summary:
      'Major bridge closures on Highway 13, Burnsville Parkway, and 35W have created severe commute disruptions and safety hazards due to poor construction coordination and inadequate traffic management.',
    details:
      'Citizens report that former 5-minute trips now take 30 minutes, with specific complaints about County Road 5 traffic being "ridiculous" and dangerous conditions at intersections like Burnhaven and County Road 42 where multiple cars run red lights daily. The simultaneous closure of three major bridges is described as "very poor planning" and creates daily safety hazards.',
    mentionCount: 187,
    representativeComments: [
      {
        comment:
          'Motorists exiting HWY 13 eastbound just to jump the line by crossing over county road 5 putting kids who attend Abbott Elementary at an increased safety risk',
        name: 'Joe Schmitt',
      },
      {
        comment:
          'I am not a fan of the traffic conditions in Burnsville, MN. I think it is a problem that needs to be addressed.',
        name: 'Jane Doe',
      },
      {
        comment:
          'I think the traffic conditions in Burnsville, MN are a problem that needs to be addressed.',
        name: 'John Doe',
      },
    ],
  },
  {
    id: 2,
    title: 'Public Safety & Crime',
    summary:
      'Residents report a fundamental breakdown in community safety, with 133 citizen complaints highlighting increased retail theft, rising emergency calls, and a pervasive sense of insecurity that has transformed the suburban character of the community.',

    details:
      'Community members express deep concern about deteriorating public safety conditions, citing increased break-ins at local businesses like Target and Cub Foods, rising emergency response times, and a general feeling that law enforcement presence has diminished. Residents report witnessing more frequent incidents of vandalism, drug-related activities in public spaces, and aggressive panhandling that makes families uncomfortable visiting downtown areas. Many longtime residents note this represents a significant departure from the safe, family-friendly environment that originally attracted them to the community.',
    mentionCount: 133,
    representativeComments: [
      {
        comment:
          'I used to feel safe walking around downtown Burnsville with my kids, but now I avoid it completely. Too many sketchy people hanging around the businesses.',
        name: 'Sarah Johnson',
      },
      {
        comment:
          "The Target on County Road 42 has been hit by thieves three times this month. When I asked the manager about it, they just shrugged like it's normal now.",
        name: 'Mike Peterson',
      },
      {
        comment:
          "Called 911 for a break-in at my neighbor's house and it took 25 minutes for police to show up. That's unacceptable for a community like ours.",
        name: 'Linda Chen',
      },
    ],
  },
  {
    id: 3,
    title: 'Tax Burden & Affordability',
    summary:
      'Unsustainable tax increases are forcing financial hardship on residents, particularly seniors on fixed incomes, with documented cases of taxes rising 42% over nine years ($13,000 to $18,500) - far exceeding inflation rates.',
    details:
      'The average property tax bill in Burnsville increased by 42% over the past nine years, from $13,000 to $18,500, while the Consumer Price Index (CPI) only rose by 14.7% during the same period. Seniors on fixed incomes are particularly vulnerable, with many struggling to afford essential services like healthcare and housing, leading to calls for more progressive tax policies that reduce burdens on low-income households.',

    mentionCount: 75,
    representativeComments: [],
  },
]
