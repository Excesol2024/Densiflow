import Homepage from "../layout/Homepage";
import Home from "../pages/Home"
import Login from "../pages/Login";
import Users from "../pages/Users";

export const publicRoute = [
    {
        path: '*',
        element: Homepage,
      },
];

export const userRoute = [
    {
        path: "/",
        element: Home
    },
    {
        path: "/login",
        element: Login
    },
    {
        path: "/users",
        element: Users
    },
]