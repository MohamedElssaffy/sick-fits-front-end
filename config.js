import 'dotenv/config';

export const endpoint = `http://localhost:3000/api/graphql`;
export const prodEndpoint = process.env.BACKEND_URL;
export const perPage = 2;
