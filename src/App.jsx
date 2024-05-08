/* eslint-disable max-len */
/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const initialProducts = productsFromServer.map(product => {
  const category = categoriesFromServer.find(c => c.id === product.categoryId);
  const user = usersFromServer.find(u => u.id === category.ownerId);

  return { category, user, ...product };
});

const SortLink = ({ isActive, isReversed, onClick }) => (
  <a href="#/" onClick={onClick}>
    <span className="icon">
      <i
        data-cy="SortIcon"
        className={cn('fas', {
          'fa-sort': !isActive,
          'fa-sort-up': isActive && !isReversed,
          'fa-sort-down': isActive && isReversed,
        })}
      />
    </span>
  </a>
);

export const App = () => {
  const [categoryIds, setCategoryIds] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);

  const [query, setQuery] = React.useState('');
  const normalizedQuery = query.trim().toLowerCase();

  const [sortColumn, setSortColumn] = React.useState('');
  const [isReversed, setIsReversed] = React.useState(false);

  function sortBy(column) {
    const first = column !== sortColumn;
    const second = column === sortColumn && !isReversed;
    const third = column === sortColumn && isReversed;

    if (first) {
      setSortColumn(column);
      setIsReversed(false);
    }

    if (second) {
      setSortColumn(column);
      setIsReversed(true);
    }

    if (third) {
      setSortColumn('');
      setIsReversed(false);
    }
  }

  function reset() {
    setQuery('');
    setSelectedUser(null);
    setCategoryIds([]);
  }

  let products = [...initialProducts];

  // #region Filters
  if (normalizedQuery) {
    products = products.filter(product =>
      product.name.toLowerCase().includes(normalizedQuery),
    );
  }

  if (selectedUser) {
    products = products.filter(product => product.user.id === selectedUser?.id);
  }

  if (categoryIds.length > 0) {
    products = products.filter(product =>
      categoryIds.includes(product.categoryId),
    );
  }
  // #endregion

  if (sortColumn) {
    products.sort((productA, productB) => {
      switch (sortColumn) {
        case 'ID':
          return productA.id - productB.id;
        case 'Product':
          return productA.name.localeCompare(productB.name);
        case 'Category':
          return productA.category.title.localeCompare(productB.category.title);
        case 'User':
          return productA.user.name.localeCompare(productB.user.name);
        default:
          return 0;
      }
    });
  }

  if (isReversed) {
    products.reverse();
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUser(null)}
                className={cn({ 'is-active': selectedUser === null })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href={`#/user-${user.id}`}
                  className={cn({ 'is-active': selectedUser?.id === user.id })}
                  onClick={() => setSelectedUser(user)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': categoryIds.length > 0,
                })}
                onClick={() => setCategoryIds([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': categoryIds.includes(category.id),
                  })}
                  href="#/"
                  key={category.id}
                  onClick={() => {
                    if (categoryIds.includes(category.id)) {
                      setCategoryIds(
                        categoryIds.filter(id => id !== category.id),
                      );
                    } else {
                      setCategoryIds([...categoryIds, category.id]);
                    }
                  }}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={reset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {products.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <SortLink
                        isActive={sortColumn === 'ID'}
                        isReversed={isReversed}
                        onClick={() => sortBy('ID')}
                      />
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <SortLink
                        isActive={sortColumn === 'Product'}
                        isReversed={isReversed}
                        onClick={() => sortBy('Product')}
                      />
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <SortLink
                        isActive={sortColumn === 'Category'}
                        isReversed={isReversed}
                        onClick={() => sortBy('Category')}
                      />
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <SortLink
                        isActive={sortColumn === 'User'}
                        isReversed={isReversed}
                        onClick={() => sortBy('User')}
                      />
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map(({ category, user, ...product }) => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {`${category.icon} - ${category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-link': user.sex === 'm',
                        'has-text-danger': user.sex === 'f',
                      })}
                    >
                      {user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
