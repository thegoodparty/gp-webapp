export function candidateName(app) {
    let name = 'n/a';
    let { data } = app;
    if (data && typeof data === 'string') {
      data = JSON.parse(data);
    }
    if (data.candidate) {
      name = `${data.candidate.firstName} ${data.candidate.lastName}`;
    }
    return name;
  }
  
  export function candidatePhoto(app) {
    let { data } = app;
    if (data && typeof data === 'string') {
      data = JSON.parse(data);
    }
    return data?.campaign?.headshotPhoto || false;
  }
  
  export function runningFor(app) {
    let { data } = app;
    if (data && typeof data === 'string') {
      data = JSON.parse(data);
    }
    if (data?.campaign && data.campaign['running for']) {
      return `Running for ${data.campaign['running for']}`;
    }
    return 'No office specified';
  }