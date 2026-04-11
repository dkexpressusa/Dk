import { RouteObject } from 'react-router-dom';
import HomePage from '@/pages/home/page';
import ShippingPage from '@/pages/shipping/page';
import MovingPage from '@/pages/moving/page';
import HowToPage from '@/pages/howto/page';
import ReviewsPage from '@/pages/reviews/page';
import ContactPage from '@/pages/contact/page';
import TrackingPage from '@/pages/tracking/page';
import FAQPage from '@/pages/faq/page';
import AdminLoginPage from '@/pages/admin/login/page';
import AdminDashboardPage from '@/pages/admin/dashboard/page';
import ProtectedRoute from '@/components/feature/ProtectedRoute';
import NotFound from '@/pages/NotFound';

const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/shipping', element: <ShippingPage /> },
  { path: '/moving', element: <MovingPage /> },
  { path: '/how-to-use', element: <HowToPage /> },
  { path: '/reviews', element: <ReviewsPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/tracking', element: <TrackingPage /> },
  { path: '/faq', element: <FAQPage /> },
  { path: '/admin', element: <AdminLoginPage /> },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
  { path: '*', element: <NotFound /> },
];

export default routes;
