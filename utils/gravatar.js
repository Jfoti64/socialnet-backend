import md5 from 'md5';

const getGravatarUrl = (email, size = 200) => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}`;
};

export default getGravatarUrl;
