import React from 'react'

const CategoriesGrid = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <header className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl font-bold">Oso Website</h1>
          <nav className="space-x-6 flex items-center">
            <a href="#" className="hover:underline">Work</a>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Contact</a>
          </nav>
        </header>

        {/* Main categories as primary content */}
        <main className="py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="#" className="group relative overflow-hidden block h-[40vh]">
              <img src="https://images.squarespace-cdn.com/content/v1/624b503a0f4c592cc4f897d2/1649102909179-FTPJ2WRJQFWKZD59YSUF/PDN57.jpg?format=1500w" alt="People" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition"></div>
              <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition">People</span>
            </a>

            <a href="#" className="group relative overflow-hidden block h-[40vh]">
              <img src="https://images.squarespace-cdn.com/content/v1/624b503a0f4c592cc4f897d2/1649102909079-4O2SP45JM79A46Q5BN3Y/20140302_Trade+151_0385.jpg?format=1500w" alt="Interiors" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition"></div>
              <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition">Interiors</span>
            </a>

            <a href="#" className="group relative overflow-hidden block h-[40vh]">
              <img src="https://images.squarespace-cdn.com/content/v1/624b503a0f4c592cc4f897d2/1649102909329-RP9P1SXMHL6TJ7BUX01H/Aro+Ha_0955.jpg?format=1500w" alt="Outdoors" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition"></div>
              <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition">Outdoors</span>
            </a>

            <a href="#" className="group relative overflow-hidden block h-[40vh]">
              <img src="https://images.squarespace-cdn.com/content/v1/624b503a0f4c592cc4f897d2/1649102909481-YBPRGO13GY7YCFIOVXKO/20130731_Trade+100_0357.jpg?format=1500w" alt="City" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition"></div>
              <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition">City</span>
            </a>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-10 bg-black text-white text-center">
          <div className="max-w-[1400px] mx-auto px-6">
            <p>&copy; 2025 Oso Website. Made with love.</p>
            <div className="mt-4 space-x-4">
              <a href="#" className="hover:underline">Instagram</a>
              <a href="#" className="hover:underline">Twitter</a>
              <a href="#" className="hover:underline">YouTube</a>
            </div>
            <div className="mt-6">
              <input type="email" placeholder="Subscribe to newsletter" className="p-2 text-black" />
              <button className="ml-2 p-2 bg-white text-black">Sign Up</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default CategoriesGrid