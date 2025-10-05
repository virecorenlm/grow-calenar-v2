import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { DashboardPage } from '@/pages/DashboardPage';
import { GrowDetailPage } from '@/pages/GrowDetailPage';
import { StrainsPage } from '@/pages/StrainsPage';
import { NutrientsPage } from '@/pages/NutrientsPage';
import { AdminPage } from '@/pages/AdminPage';
import { GuidesPage } from '@/pages/GuidesPage';
import { AppLayout } from './components/AppLayout';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/grows/:id",
        element: <GrowDetailPage />,
      },
      {
        path: "/strains",
        element: <StrainsPage />,
      },
      {
        path: "/nutrients",
        element: <NutrientsPage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/guides",
        element: <GuidesPage />,
      },
    ]
  }
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)