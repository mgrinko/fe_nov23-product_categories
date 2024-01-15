import React from 'react';
import cn from 'classnames';

export const SortLink = ({ isActive, isReversed, onClick }) => (
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
