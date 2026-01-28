'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/app/types/event';
import styles from './EventDetails.module.css';

interface EventDetailsProps {
  readonly event: Event;
}

export default function EventDetails({ event }: EventDetailsProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    // Trap focus within modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-title"
      >
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close event details"
          title="Close"
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

        {/* Event Image */}
        <div
          className={styles.eventImage}
          style={{
            background: event.image || 'linear-gradient(135deg, #667eea, #764ba2)',
          }}
          aria-hidden="true"
        />

        {/* Event Content */}
        <div className={styles.content}>
          <h1 id="event-title" className={styles.title}>
            {event.title}
          </h1>

          {/* Category Badge */}
          <div className={styles.categoryBadge}>
            <span>{event.category}</span>
          </div>

          {/* Key Information Grid */}
          <div className={styles.infoGrid}>
            {event.date && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>📅 Date</span>
                <span className={styles.infoValue}>{event.date}</span>
              </div>
            )}

            {event.startTime && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>🕐 Start Time</span>
                <span className={styles.infoValue}>{event.startTime}</span>
              </div>
            )}

            {event.location && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>📍 Location</span>
                <span className={styles.infoValue}>{event.location}</span>
              </div>
            )}

            {event.ticketPrice && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>🎫 Ticket Price</span>
                <span className={styles.infoValue}>{event.ticketPrice}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className={styles.descriptionSection}>
              <h2 className={styles.descriptionTitle}>About This Event</h2>
              <p className={styles.description}>{event.description}</p>
            </div>
          )}

          {/* Action Button */}
          <button className={styles.actionButton} aria-label="Register for event">
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
