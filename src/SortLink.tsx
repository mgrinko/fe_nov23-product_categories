/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

interface Props {
  isActive: boolean;
  isReversed: boolean;
  onClick?: () => void;
}

export const SortLink: React.FC<Props> = ({
  isActive,
  isReversed,
  onClick,
}) => (
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
