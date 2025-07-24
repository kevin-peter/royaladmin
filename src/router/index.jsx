import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomeRoute from "./HomeRoute";
import EventRoute from "./EventRoute";

import Login from "../containers/views/Main/Login";

const routes = [
  { path: '/', element: <Login /> },
  { path: '/login', element: <Login /> },
  { path: '/*', element: <HomeRoute /> },
  { path: '/event/*', element: <EventRoute /> },
  {
    path: '/logout/*',
    element: <Navigate to={`/login?${Math.random()}`} key={3} />
  }
];

export default routes;

// const RT = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/*" element={<HomeRoute />} />
//       <Route path="/event/*" element={<EventRoute />} />
      
//       <Route
//         path="/logout/*"
//         element={<Navigate to={`/login?` + Math.random()} key={3} />}
//       />
//     </Routes>
//   );
// };


// export default RT;