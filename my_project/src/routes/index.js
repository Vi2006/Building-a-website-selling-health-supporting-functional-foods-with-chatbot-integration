// routes.js
import HomePage from "../pages/HomePage/HomePage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import SingInPage from "../pages/SignInPage/SingInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import AdminPage from "../pages/AdminPage/AdminPage";
import { CheckOut } from "../components/CheckOut/CheckOut";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
import { Thanhly } from "../components/Thanhly/Thanhly";

export const routes = [
  { path: "/", page: HomePage, isShowHeader: true },
  { path: "/order", page: OrderPage, isShowHeader: true },
  { path: "/product", page: ProductsPage, isShowHeader: true },
  { path: "/product/:type", page: TypeProductPage, isShowHeader: true },
  { path: "/sign-in", page: SingInPage, isShowHeader: false },
  { path: "/sign-up", page: SignUpPage, isShowHeader: false },
  { path: "/check-out", page: CheckOut, isShowHeader: true },
  { path: "/my-order", page: MyOrderPage, isShowHeader: true },
  { path: "/thanhly/:id", page: Thanhly, isShowHeader: false },

  {
    path: "/product-details/:id",
    page: ProductDetailsPage,
    isShowHeader: true,
  },
  { path: "/profile-user", page: ProfilePage, isShowHeader: true },
  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: false,
    isPrivate: true,
  },
  { path: "*", page: NotFoundPage },
];
