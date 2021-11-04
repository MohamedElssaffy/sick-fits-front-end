export const endpoint = `http://localhost:3000/api/graphql`;
export const prodEndpoint = process.env.NEXT_PUBLIC_BACKEND_URL;
export const perPage = 2;

console.log({ endpoint });
console.log({ prodEndpoint });
