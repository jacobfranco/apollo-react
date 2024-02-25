import type { CaptureContext, UserFeedback } from '@sentry/types';
import type { SetOptional } from 'type-fest';

/** Capture the exception and report it to Sentry. */
async function captureSentryException (
  exception: any,
  captureContext?: CaptureContext | undefined,
): Promise<string> {
  const Sentry = await import('@sentry/react');
  return Sentry.captureException(exception, captureContext);
}

/** Capture user feedback and report it to Sentry. */
async function captureSentryFeedback(feedback: SetOptional<UserFeedback, 'name' | 'email'>): Promise<void> {
  const Sentry = await import('@sentry/react');
  Sentry.captureUserFeedback(feedback as UserFeedback);
}

export {
  captureSentryException,
  captureSentryFeedback
}