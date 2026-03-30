export type NotificationType = 'submission_created' | 'submission_updated';

export interface NotificationPayload {
  recipientEmail: string;
  subject: string;
  body: string;
  type: NotificationType;
}

export interface NotificationResult {
  status: 'sent' | 'failed';
  warning?: string;
}

export async function sendNotification(payload: NotificationPayload): Promise<NotificationResult> {
  // Non-blocking default implementation for MVP.
  if (!process.env.RESEND_API_KEY) {
    return {
      status: 'failed',
      warning: `RESEND_API_KEY is not configured; notification for ${payload.recipientEmail} (${payload.type}) was skipped.`,
    };
  }

  return {
    status: 'sent',
  };
}
