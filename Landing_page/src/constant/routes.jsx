import Homepage from "../layout/Homepage";
import Home from "../pages/Home"

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
    }
]