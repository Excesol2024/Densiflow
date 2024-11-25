import { Routes, Route } from 'react-router-dom';
import { publicRoute } from '../constant/routes';

export default function Routepages() {
  return (
    <Routes>
    {publicRoute.map((route, index) => (
      <Route key={index} path={route.path} element={<route.element />} />
    ))}
  </Routes>
  )
}
