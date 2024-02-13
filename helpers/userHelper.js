export const getInitials = (user) => {
  if (!user) {
    return '';
  }
  const { firstName, lastName } = user;
  if (!firstName) {
    return false;
  }
  const initialsArr = name.split(' ');
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

export const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
