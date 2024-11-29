import React from 'react'
import banner from "../data/banner.jpg"; 

function Dashboard() {
  return (
    <div className="mt-8">
      <div
        className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl p-8 pt-9 m-3 bg-cover bg-no-repeat border border-gray-300"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: "15%",
          backgroundPosition: "right", 
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-500 text-xl">Welcome Admin!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;