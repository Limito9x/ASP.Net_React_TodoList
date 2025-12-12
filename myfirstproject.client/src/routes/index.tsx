import { type RouteObject, useRoutes } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home";
import PlanPage from "../pages/Plan";
import TaskPage from "../pages/Task";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

export const AppRoutes = () => {
    const routes: RouteObject[] = [
        {
            path: "/",
            element: <RootLayout />,
            children: [
                {
                    index: true,
                    element: <Home />
                },
                {
                    path: "plans",
                    element: <PlanPage />
                },
                {
                    path: "plans/:planId",
                    element: <TaskPage />
                }
            ]
        },
        {
            path: "/login",
            element: <LoginPage />
        },
        {
            path: "/register",
            element: <RegisterPage />
        }
    ];

    return useRoutes(routes);
}