'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import SearchBar from '@/app/components/SearchBar/SearchBar';
import { PUBLIC_ROUTES } from '@/app/lib/public-routes';
import styles from './Header.module.css';

const CATEGORY_TABS = [
  { id: 'concerts', label: 'Concerts' },
  { id: 'sports', label: 'Sports' },
  { id: 'festivals', label: 'Festivals' },
  { id: 'food', label: 'Food & Drink' },
  { id: 'art', label: 'Art & Culture' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('concerts');
  const mobileMenuDialogRef = useRef<HTMLDialogElement | null>(null);
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
    let focusTimeout: ReturnType<typeof setTimeout> | undefined;

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const focusMenu = () => {
        mobileMenuDialogRef.current
          ?.querySelector<HTMLElement>('[data-mobile-menu-initial-focus="true"]')
          ?.focus();
      };

      focusTimeout = setTimeout(focusMenu, 50);
    }

    return () => {
      if (focusTimeout) {
        clearTimeout(focusTimeout);
      }
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

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
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
        <header className={`${styles.header} ${styles.sticky} ${styles.frostedGlass}`}>
          {/* Logo Section */}
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <span className={styles.logoText}>PLUG IN</span>
            </div>

            {/* Hamburger Menu Button */}
            <button
              type="button"
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
          </div>

          {/* Desktop Search Bar */}
          <div className={styles.desktopSearch}>
            <SearchBar />
          </div>
        </header>
      </div>

      {/* Mobile Navigation Menu */}
      <dialog
        id="mobile-menu-dialog"
        ref={mobileMenuDialogRef}
        aria-modal="true"
        aria-label="Mobile menu"
        open={mobileMenuOpen}
        className={`${styles.mobileNav} ${
          mobileMenuOpen ? styles.mobileNavOpen : styles.mobileNavClosed
        }`}
      >
        <div className={styles.mobileNavHeader}>
          <button
            type="button"
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
        <nav id="mobile-nav" className={styles.mobileNavContent} aria-label="Mobile navigation">
          <ul className={styles.mobileNavList} aria-label="Mobile menu items">
            <li className={styles.mobileNavListItem}>
              <Link
                href={PUBLIC_ROUTES.home}
                data-mobile-menu-initial-focus="true"
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            <li className={styles.mobileNavListItem}>
              <Link
                href={PUBLIC_ROUTES.events}
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                Events
              </Link>
            </li>
            <li className={styles.mobileNavListItem}>
              <Link
                href={PUBLIC_ROUTES.contactUs}
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                Contact Us
              </Link>
            </li>
            <li className={styles.mobileNavListItem}>
              <Link
                href={PUBLIC_ROUTES.privacyPolicy}
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                Privacy Policy
              </Link>
            </li>
          </ul>

          <div className={styles.mobileNavDivider}></div>

          <section className={styles.mobileTabsContainer} aria-label="Event categories">
            <ul className={styles.mobileTabsList} aria-label="Category shortcuts">
              {CATEGORY_TABS.map((tab) => (
                <li key={tab.id} className={styles.mobileTabsListItem}>
                  <button
                    type="button"
                    className={`${styles.mobileTab} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      closeMobileMenu();
                    }}
                    aria-pressed={activeTab === tab.id}
                  >
                    <span className={styles.tabLabel}>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </nav>
      </dialog>
    </>
  );
}
