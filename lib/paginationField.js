import { PAGINTATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    //  For tell apollo cache i will take care of that
    keyArgs: false,
    // See if the items in the cache or go to make request
    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      const data = cache.readQuery({ query: PAGINTATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      const items = existing.slice(skip, skip + first).filter((x) => x);

      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        return false;
      }

      if (items.length) {
        return items;
      }

      return false;
    },
    // After making reuest call this merged function to save new data in cache and return run read to get items from it
    merge(existing, incoming, { args }) {
      const { skip } = args;
      const merged = existing ? existing.slice(0) : [];
      // eslint-disable-next-line no-plusplus
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      return merged;
    },
  };
}
