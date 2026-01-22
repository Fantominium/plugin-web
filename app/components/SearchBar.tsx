'use client';

import React from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  return (
    <div className={`${styles.searchBar} search-bar`}>
      <input
        type="search"
        placeholder="Search events, venues..."
        className={styles.searchInput}
        aria-label="Search events"
      />
      <button
        type="button"
        className={styles.searchButton}
        aria-label="Search"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>
    </div>
  );
}
