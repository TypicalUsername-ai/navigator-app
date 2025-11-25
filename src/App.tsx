import { Routes, Route } from 'react-router-dom'
import {
  HomeRoute,
  WelcomeRoute,
  CityRoute,
  ParkingRoute,
  TransportRoute,
  TrainsRoute
} from '@/routes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/welcome" element={<WelcomeRoute />} />
      <Route path="/:city" element={<CityRoute />} />
      <Route path="/:city/parking" element={<ParkingRoute />} />
      <Route path="/:city/transport" element={<TransportRoute />} />
      <Route path="/:city/trains" element={<TrainsRoute />} />
    </Routes>
  )
}

export default App
