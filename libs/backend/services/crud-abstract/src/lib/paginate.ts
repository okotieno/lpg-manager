import { FindOptions } from 'sequelize';

export const paginate = (query: FindOptions, { page = 0, pageSize = 25 }) => {
  const offset = page * pageSize;
  const limit = pageSize;

  return {
    ...query,
    offset,
    limit
  } as FindOptions;
};
