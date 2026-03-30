/**
 * Unauthorized page
 * Shown when user is authenticated but doesn't have permission to access resource
 */

import Link from 'next/link';
import { PUBLIC_ROUTES } from '@/app/lib/public-routes';

export default function UnauthorizedPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center px-4"
    >
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl font-bold text-[#ff6b6b] mb-4">403</div>
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access this resource.</p>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          If you believe this is an error, please contact support or return to the home page.
        </p>

        <div className="space-y-3">
          <Link
            href={PUBLIC_ROUTES.home}
            className="inline-block w-full px-4 py-3 bg-[#667eea] hover:bg-[#764ba2] text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 transition-colors"
          >
            Go to Home
          </Link>
          <Link
            href={PUBLIC_ROUTES.contactUs}
            className="inline-block w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
