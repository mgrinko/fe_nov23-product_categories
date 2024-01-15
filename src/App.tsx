/* eslint-disable max-len, jsx-a11y/accessible-emoji */
import React from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { User, Category, Product } from './types';
import { ProductTable } from './ProductTable';

const initialProducts: Product[] = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(c => c.id === product.categoryId) as Category;

  const user: User | null = usersFromServer
    .find(u => u.id === category.ownerId) || null;

  return { category, user, ...product };
});

export const App = () => {
  const [categoryIds, setCategoryIds] = React.useState<number[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const [query, setQuery] = React.useState('');
  const normalizedQuery = query.trim().toLowerCase();

  function reset() {
    setQuery('');
    setSelectedUser(null);
    setCategoryIds([]);
  }

  let products = [...initialProducts];

  // #region Filters
  if (normalizedQuery) {
    products = products.filter(
      product => product.name.toLowerCase().includes(normalizedQuery),
    );
  }

  if (selectedUser) {
    products = products.filter(
      product => product.user?.id === selectedUser.id,
    );
  }

  if (categoryIds.length > 0) {
    products = products.filter(
      product => categoryIds.includes(product.categoryId),
    );
  }
  // #endregion

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
            <ProductTable products={products} />
          )}
        </div>
      </div>
    </div>
  );
};
