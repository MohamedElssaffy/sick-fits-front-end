/* eslint-disable react/jsx-props-no-spreading */
import { useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';

import { DropDown, SearchStyles, DropDownItem } from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchValue: String!) {
    searchItem: products(
      where: {
        OR: [
          { name: { contains: $searchValue, mode: insensitive } }
          { description: { contains: $searchValue, mode: insensitive } }
        ]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  const router = useRouter();
  const [findItem, { loading, data }] = useLazyQuery(SEARCH_PRODUCTS_QUERY, {
    fetchPolicy: 'no-cache',
  });

  const items = data ? data.searchItem : [];

  const findItemButChill = debounce(findItem, 350);

  resetIdCounter();

  const {
    inputValue,
    getMenuProps,
    getComboboxProps,
    getItemProps,
    getInputProps,
    isOpen,
    setInputValue,
    highlightedIndex,
  } = useCombobox({
    items,
    onInputValueChange() {
      findItemButChill({ variables: { searchValue: inputValue } });
    },
    onSelectedItemChange({ selectedItem }) {
      router.push({
        pathname: `/product/${selectedItem.id}`,
      });
      setInputValue('');
    },
    itemToString: (item) => (item ? item.name : ''),
  });

  useEffect(() => {
    setInputValue('');
  }, [setInputValue]);
  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            id: 'search',
            placeholder: 'Search for an item',
            className: loading ? 'loading' : '',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              key={item.id}
              {...getItemProps({ item, index })}
              highlighted={index === highlightedIndex}
            >
              <img
                src={item.photo?.image?.publicUrlTransformed}
                width='50'
                alt={item.name}
              />
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, No items found for {inputValue} </DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}
