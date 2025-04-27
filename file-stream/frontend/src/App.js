import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Create from './page/Create';
import Delete from './page/Delete';
import File from './page/File';
import Home from './page/Home';
import Read from './page/Read';

const router = createBrowserRouter([ 
  {
    path: "/", 
    element: <Home />
  },

  {
    path: "/file", 
    element: <File />
  },

  {
    path: "/create", 
    element: <Create />
  },

  
  {
    path: "/read", 
    element: <Read />
  },

  {
    path: "/del", 
    element: <Delete />
  },
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
