import React from 'react';
import cn from 'classnames';
import { SortLink } from './SortLink';
import { Product } from './types';

export const ProductTable = ({ products }: { products: Product[]; }) => {
  const [sortColumn, setSortColumn] = React.useState('');
  const [isReversed, setIsReversed] = React.useState(false);

  function sortBy(column: string) {
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

  const visibleProducts = [...products];

  if (sortColumn) {
    visibleProducts.sort((productA, productB) => {
      switch (sortColumn) {
        case 'ID':
          return productA.id - productB.id;

        case 'Product':
          return productA.name.localeCompare(productB.name);

        case 'Category':
          return productA.category.title
            .localeCompare(productB.category.title);

        case 'User': {
          if (!productA.user || !productB.user) {
            return 0;
          }

          return productA.user.name
            .localeCompare(productB.user.name);
        }

        default:
          return 0;
      }
    });
  }

  if (isReversed) {
    visibleProducts.reverse();
  }

  return (
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
        {visibleProducts.map(({ category, user, ...product }) => (
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
                'has-text-link': user?.sex === 'm',
                'has-text-danger': user?.sex === 'f',
              })}
            >
              {user?.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
