import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import Page1 from './pages/Page1'
import Page2 from './pages/Page2'
import Home from './pages/Home'
import Productdetails from './pages/Productdetails'
import Admin from './pages/admin'

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

      <main className="  px-4 bg-white w-screen min-h-screen ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/productdetails/:id" element={<Productdetails />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    // </div>
  )
}

export default App