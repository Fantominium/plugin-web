'use client';

import React, { useState, useCallback, useEffect } from 'react';
import SearchBar from './SearchBar';
import styles from './Header.module.css';

const CATEGORY_TABS = [
  { id: 'concerts', label: 'Concerts', icon: '🎵' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'festivals', label: 'Festivals', icon: '🎉' },
  { id: 'food', label: 'Food & Drink', icon: '🍽️' },
  { id: 'art', label: 'Art & Culture', icon: '🎨' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('concerts');

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <div className={styles.headerWrapper}>
        <header
          role="banner"
          className={`${styles.header} ${styles.sticky} ${styles.frostedGlass}`}
        >
          {/* Logo Section */}
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <span className={styles.logoText}>PLUG IN</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav
            role="navigation"
            className={`${styles.desktopNav} ${styles.navigation}`}
            aria-label="Main navigation"
          >
            <a href="/" className={styles.navLink}>
              Home
            </a>
            <a href="/events" className={styles.navLink}>
              Events
            </a>
            <a href="/categories" className={styles.navLink}>
              Categories
            </a>
            <a href="/about" className={styles.navLink}>
              About
            </a>
          </nav>

          {/* Desktop Search Bar */}
          <div className={styles.desktopSearch}>
            <SearchBar />
          </div>

          {/* Hamburger Menu Button */}
          <button
            className={styles.hamburger}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </header>

        {/* Category Tabs */}
        <div className={styles.categoryTabsContainer}>
          <nav
            className={styles.categoryTabs}
            aria-label="Category filter"
            role="navigation"
          >
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.categoryTab} ${
                  activeTab === tab.id ? styles.active : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={activeTab === tab.id}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <nav
        id="mobile-nav"
        role="navigation"
        className={`${styles.mobileNav} ${
          mobileMenuOpen ? styles.mobileNavOpen : styles.mobileNavClosed
        }`}
        aria-label="Mobile navigation"
      >
        <div className={styles.mobileNavContent}>
          <a href="/" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            Home
          </a>
          <a
            href="/events"
            className={styles.mobileNavLink}
            onClick={closeMobileMenu}
          >
            Events
          </a>
          <a
            href="/categories"
            className={styles.mobileNavLink}
            onClick={closeMobileMenu}
          >
            Categories
          </a>
          <a
            href="/about"
            className={styles.mobileNavLink}
            onClick={closeMobileMenu}
          >
            About
          </a>

          <div className={styles.mobileNavDivider}></div>

          <div className={styles.mobileTabsContainer}>
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.mobileTab} ${
                  activeTab === tab.id ? styles.active : ''
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  closeMobileMenu();
                }}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main id="main-content"></main>
    </>
  );
}
