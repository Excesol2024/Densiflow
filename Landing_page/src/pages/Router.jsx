import { Routes, Route } from 'react-router-dom';
import { userRoute } from '../constant/routes';
export default function Router() {
  return (
    <Routes>
    {userRoute.map((route, index) => (
      <Route key={index} path={route.path} element={<route.element />} />
    ))}
  </Routes>
  )
}
