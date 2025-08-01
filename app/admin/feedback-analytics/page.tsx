import { FeedbackAnalyticsDashboard } from '@/components/admin/FeedbackAnalyticsDashboard';
import { AdminGuard } from '@/components/admin/AdminGuard';

export default function FeedbackAnalyticsPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FeedbackAnalyticsDashboard />
        </div>
      </div>
    </AdminGuard>
  );
} 