import { type RouteObject, useRoutes } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home";
import PlanPage from "../pages/Plan";
import PhasePage from "../pages/Phase";
import TaskIndexPage from "../pages/PlanDetail";
import Task from "../pages/Task";
import TemplatePage from "../pages/Template";
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
                    path: "template",
                    element: <TemplatePage />
                },
                {
                    path: "plans",
                    element: <PlanPage />
                },
                {
                    path: "plans/:planId",
                    element: <TaskIndexPage />
                },
                {
                    path: "plans/:planId/phases/:phaseId",
                    element: <PhasePage />
                },
                {
                    path: "tasks/:taskId",
                    element: <Task />
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