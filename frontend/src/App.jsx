import { useState, useEffect } from 'react'

function App() {
  const [apiStatus, setApiStatus] = useState('checking...')
  const [apiMessage, setApiMessage] = useState('')

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => {
        setApiStatus('connected')
        setApiMessage(data.message)
      })
      .catch(() => {
        setApiStatus('disconnected')
        setApiMessage('Unable to connect to backend')
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation Header */}
      <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🏃‍♂️</div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Jones County XC</h1>
            </div>
            <div className="hidden md:flex space-x-1">
              <a href="#" className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-all">High School</a>
              <a href="#" className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-all">Runners</a>
              <a href="#" className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-all">Top Hounds</a>
              <a href="#" className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-all">Health</a>
              <a href="#" className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-all">Middle School</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
            Welcome to Jones County
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            Cross Country
          </h2>
          <p className="text-2xl md:text-3xl text-purple-100 font-light max-w-3xl mx-auto">
            Building champions on and off the track
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* API Status */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  apiStatus === 'connected' ? 'bg-white' :
                  apiStatus === 'checking...' ? 'bg-yellow-300' :
                  'bg-red-300'
                }`}></div>
                <p className="font-semibold text-lg">
                  {apiMessage || 'Connecting to server...'}
                </p>
              </div>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{apiStatus}</span>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-block">
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                📅 Upcoming Schedule
              </h3>
              <div className="h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider">Date</th>
                    <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider">Meet</th>
                    <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider">Location</th>
                    <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider">Results</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-8 py-5 text-gray-900 font-medium">TBA</td>
                    <td className="px-8 py-5 text-gray-900 font-semibold">Season Opening Meet</td>
                    <td className="px-8 py-5 text-gray-600">TBA</td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-8 py-5 text-gray-900 font-medium">TBA</td>
                    <td className="px-8 py-5 text-gray-900 font-semibold">Regional Championship</td>
                    <td className="px-8 py-5 text-gray-600">TBA</td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-8 py-5 text-gray-900 font-medium">TBA</td>
                    <td className="px-8 py-5 text-gray-900 font-semibold">State Championship</td>
                    <td className="px-8 py-5 text-gray-600">TBA</td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Championship Highlights */}
        <section className="mb-20">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTEyIDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0yNCAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
            <div className="relative px-8 py-16 text-center text-white">
              <div className="text-7xl mb-6">🏆</div>
              <h3 className="text-5xl md:text-6xl font-black mb-4">CHAMPIONS</h3>
              <p className="text-2xl md:text-3xl font-light">Building Excellence in Cross Country</p>
            </div>
          </div>
        </section>

        {/* Exploration Cards */}
        <section>
          <div className="text-center mb-12">
            <h3 className="text-5xl font-black text-gray-800 mb-2">Explore Our Program</h3>
            <p className="text-xl text-gray-600">Discover what makes us special</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Runners Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-4 border-transparent hover:border-purple-400">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-8">
                <div className="text-6xl mb-5">🏃</div>
                <h4 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">Runners</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">Meet our dedicated athletes and track their progress throughout the season.</p>
                <a href="#" className="inline-flex items-center text-purple-600 font-bold hover:text-purple-700 transition-colors">
                  Learn More
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Results Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-4 border-transparent hover:border-blue-400">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <div className="p-8">
                <div className="text-6xl mb-5">📊</div>
                <h4 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">Results</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">View meet results, times, and performance statistics for both teams.</p>
                <a href="#" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors">
                  View Results
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Top Hounds Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-4 border-transparent hover:border-orange-400">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <div className="p-8">
                <div className="text-6xl mb-5">🥇</div>
                <h4 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">Top Hounds</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">Celebrate our record holders and championship achievements.</p>
                <a href="#" className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700 transition-colors">
                  See Rankings
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Home Meet Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-4 border-transparent hover:border-green-400">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <div className="p-8">
                <div className="text-6xl mb-5">🏠</div>
                <h4 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">Home Meet</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">Information about our home course and hosting meets.</p>
                <a href="#" className="inline-flex items-center text-green-600 font-bold hover:text-green-700 transition-colors">
                  Get Details
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative mt-32 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-gray-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Navigation Column */}
            <div>
              <h5 className="text-white font-bold text-xl mb-6 flex items-center">
                <span className="mr-2">📍</span> Navigation
              </h5>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-purple-400 transition-colors flex items-center"><span className="mr-2">→</span> Home</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors flex items-center"><span className="mr-2">→</span> High School</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors flex items-center"><span className="mr-2">→</span> Middle School</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors flex items-center"><span className="mr-2">→</span> Runners</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h5 className="text-white font-bold text-xl mb-6 flex items-center">
                <span className="mr-2">📚</span> Resources
              </h5>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">→</span> Top Hounds</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">→</span> Results</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">→</span> Health</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">→</span> Home Meet</a></li>
              </ul>
            </div>

            {/* External Links Column */}
            <div>
              <h5 className="text-white font-bold text-xl mb-6 flex items-center">
                <span className="mr-2">🔗</span> External Links
              </h5>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-orange-400 transition-colors flex items-center"><span className="mr-2">→</span> MileSplit</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors flex items-center"><span className="mr-2">→</span> GHSA</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors flex items-center"><span className="mr-2">→</span> USA Track & Field</a></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h5 className="text-white font-bold text-xl mb-6 flex items-center">
                <span className="mr-2">📧</span> Contact
              </h5>
              <div className="space-y-3 text-sm">
                <p className="flex items-center"><span className="mr-2">🏫</span> Jones County High School</p>
                <p className="flex items-center"><span className="mr-2">📍</span> Gray, Georgia</p>
                <p className="flex items-center"><span className="mr-2">🎯</span> Team Resources</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-sm text-gray-400">&copy; 2026 Jones County Cross Country. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
