'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar/SearchBar';
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
  const firstMobileLinkRef = useRef<HTMLAnchorElement | null>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement | null>(null);
  const wasMobileMenuOpen = useRef(false);

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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const focusMenu = () => firstMobileLinkRef.current?.focus();

      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(focusMenu);
      } else {
        setTimeout(focusMenu, 0);
      }
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (wasMobileMenuOpen.current && !mobileMenuOpen) {
      hamburgerButtonRef.current?.focus();
    }

    wasMobileMenuOpen.current = mobileMenuOpen;
  }, [mobileMenuOpen]);

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
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
            <Link href="/events" className={styles.navLink}>
              Events
            </Link>
            <Link href="/categories" className={styles.navLink}>
              Categories
            </Link>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
          </nav>

          {/* Desktop Search Bar */}
          <div className={styles.desktopSearch}>
            <SearchBar />
          </div>

          {/* Hamburger Menu Button */}
          <button
            ref={hamburgerButtonRef}
            className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ''}`}
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-dialog"
            aria-haspopup="dialog"
          >
            <span className={styles.hamburgerLine} aria-hidden="true"></span>
            <span className={styles.hamburgerLine} aria-hidden="true"></span>
            <span className={styles.hamburgerLine} aria-hidden="true"></span>
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
      <dialog
        id="mobile-menu-dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        open={mobileMenuOpen}
        className={`${styles.mobileNav} ${
          mobileMenuOpen ? styles.mobileNavOpen : styles.mobileNavClosed
        }`}
      >
        <div className={styles.mobileNavHeader}>
          <button
            className={styles.mobileCloseButton}
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav
          id="mobile-nav"
          role="navigation"
          className={styles.mobileNavContent}
          aria-label="Mobile navigation"
        >
          <ul className={styles.mobileNavList} aria-label="Mobile menu items">
            <li className={styles.mobileNavListItem}>
              <Link
                href="/"
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
                ref={firstMobileLinkRef}
              >
                Home
              </Link>
            </li>
            <li className={styles.mobileNavListItem}>
              <Link
                href="/events"
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                Events
              </Link>
            </li>
            <li className={styles.mobileNavListItem}>
              <Link
                href="/categories"
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                Categories
              </Link>
            </li>
            <li className={styles.mobileNavListItem}>
              <Link
                href="/about"
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                About
              </Link>
            </li>
          </ul>

          <div className={styles.mobileNavDivider}></div>

          <div className={styles.mobileTabsContainer}>
            <ul className={styles.mobileTabsList} aria-label="Category shortcuts">
              {CATEGORY_TABS.map((tab) => (
                <li key={tab.id} className={styles.mobileTabsListItem}>
                  <button
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
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </dialog>

      <main id="main-content"></main>
    </>
  );
}
