import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import ProductFormPage from "./pages/ProductFormPage";
import ReceiptsPage from "./pages/ReceiptsPage";
import ReceiptFormPage from "./pages/ReceiptFormPage";
import DeliveriesPage from "./pages/DeliveriesPage";
import DeliveryFormPage from "./pages/DeliveryFormPage";
import TransfersPage from "./pages/TransfersPage";
import TransferFormPage from "./pages/TransferFormPage";
import AdjustmentsPage from "./pages/AdjustmentsPage";
import MovementsPage from "./pages/MovementsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignUpPage,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "/products",
    Component: ProductsPage,
  },
  {
    path: "/products/new",
    Component: ProductFormPage,
  },
  {
    path: "/products/edit/:id",
    Component: ProductFormPage,
  },
  {
    path: "/receipts",
    Component: ReceiptsPage,
  },
  {
    path: "/receipts/new",
    Component: ReceiptFormPage,
  },
  {
    path: "/receipts/edit/:id",
    Component: ReceiptFormPage,
  },
  {
    path: "/deliveries",
    Component: DeliveriesPage,
  },
  {
    path: "/deliveries/new",
    Component: DeliveryFormPage,
  },
  {
    path: "/deliveries/edit/:id",
    Component: DeliveryFormPage,
  },
  {
    path: "/transfers",
    Component: TransfersPage,
  },
  {
    path: "/transfers/new",
    Component: TransferFormPage,
  },
  {
    path: "/transfers/edit/:id",
    Component: TransferFormPage,
  },
  {
    path: "/adjustments",
    Component: AdjustmentsPage,
  },
  {
    path: "/movements",
    Component: MovementsPage,
  },
  {
    path: "/settings",
    Component: SettingsPage,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
]);
