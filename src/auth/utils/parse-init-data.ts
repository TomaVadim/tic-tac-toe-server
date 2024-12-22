import { User } from 'src/users/schemas/user.schema';

export const parseInitData = (initData: string): User => {
  const data = Object.fromEntries(
    initData.split('&').map((pair) => {
      const [key, value] = pair.split('=').map(decodeURIComponent);
      return [key, value];
    }),
  );

  const user = JSON.parse(data.user);

  return user;
};
