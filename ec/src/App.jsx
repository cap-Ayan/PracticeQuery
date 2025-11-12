import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Productdetails from './pages/Productdetails'
import Admin from './pages/admin'
import EditProduct from './pages/EditProduct'

const App = () => {
  const linkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300";
  const activeLinkClasses = "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium";

  return (
    // <div className="min-h-screen bg-gray-100">
    //   <nav className="bg-gray-800 shadow-xl">
    //     <div className="max-w-6xl mx-auto px-4">
    //       <div className="flex justify-between items-center h-16">
    //         <div className="flex items-center space-x-8">
    //           <div className="flex-shrink-0">
    //             <span className="text-white text-xl font-bold">MyStore</span>
    //           </div>
    //           <div className="hidden md:block">
    //             <div className="ml-10 flex items-baseline space-x-4">
    //               <NavLink
    //                 to="/"
    //                 className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}
    //               >
    //                 Page 1
    //               </NavLink>
    //               <NavLink
    //                 to="/page2"
    //                 className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}
    //               >
    //                 Page 2
    //               </NavLink>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </nav>

      <main className="   bg-white w-screen min-h-screen overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
        
          <Route path="/productdetails/:id" element={<Productdetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/editProducts/:id" element={<EditProduct/>} />
        </Routes>
      </main>
    // </div>
  )
}

export default App