import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContextProvider";
import Login from "../components/auth/Login";
import { ProtectedRoute } from "./ProtectedRoute";
import Dashboard from "../components/dashboard/dashboard";
import Products from "../components/products/Products";
import Sales from "../components/Sales/Sales";
import Expense from "../components/Expense/Expense";
import OtherIncome from "../components/OtherIncome/OtherIncome";
import Customer from "../components/Customer/Customer";
import Supplier from "../components/Supplier/Supplier";
import Report from "../components/report/Report";
import SalesReport from "../components/SalesReport/SalesReport";
import Setting from "../components/setting/setting";
import Register from "../components/auth/Register";

const Routes = () => {
  const { token } = useAuth();

  // Define routes accessible only to authenticated users

  let routes = [
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: '/products',
      element: <Products />
    },
    {
      path: '/sales',
      element: <Sales />
    },
    {
      path: '/expense',
      element: <Expense />
    },
    {
      path: '/otherincome',
      element: <OtherIncome />
    }, {
      path: '/customer',
      element: <Customer />
    }, {
      path: '/supplier',
      element: <Supplier />
    }, {
      path: '/report',
      element: <Report />
    },
    {
      path: '/salesreport',
      element: <SalesReport />
    }, {
      path: '/settings',
      element: <Setting />
    }


    // {
    //   path: "/dashboard",
    //   element: <Dashboard />,

    // },
    // {
    //   path: "/course",
    //   element: <CourseView />,
    // },
    // {
    //   path: "/user",
    //   element: <UserView />,
    // },
    // {
    //   path: "/lesson",
    //   element: <LessonView />,
    // },
    // {
    //   path: "/request",
    //   element: <CourseRequestView />,
    // },
    // {
    //   path: "/settings",
    //   element: <SettingsView />,
    // },
    // {
    //   path: "/lesson/coursemenu/:id",
    //   element: <CourseMenu />,
    // },
    // {
    //   path: "/auth/login",
    //   element: <Login />,
    // },
    // {
    //   path: "/auth/register",
    //   element: <Register />,
    // },
  ];



  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      errorElement: <Navigate to="/" />,
      children: routes,
    },
  ];

  const routesForPublic = [
    {
      path: "/login",
      element: <Login />,
      errorElement: <Navigate to="/" />
    },
    {
      path:'/register',
      element : <Register/>,
      errorElement: <Navigate to="/" />
    }
  ];


  // Combine and conditionally include routes based on authentication status
  const router =
    useMemo(() => (
      createBrowserRouter([
        ...routesForAuthenticatedOnly,
        ...routesForPublic,
      ])
    ), [token]);


  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;

