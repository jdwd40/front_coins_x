import './styles/globals.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
            Cryptocurrency Trading Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Welcome to your trading dashboard
          </p>
        </header>
        
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Market Overview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Market Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Current Cycle</span>
                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-lg">MILD_BOOM</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Trend</span>
                <span className="text-green-600 dark:text-green-400 font-bold text-lg">↗ Up</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Quick Actions</h2>
            <div className="space-y-3">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl">
                💰 Buy Coins
              </button>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl">
                📉 Sell Coins
              </button>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl">
                📊 View Portfolio
              </button>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">System Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400 font-medium">API Status</span>
                <span className="text-green-600 dark:text-green-400 font-bold flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400 font-medium">WebSocket</span>
                <span className="text-green-600 dark:text-green-400 font-bold flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Live
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
