import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/', label: '홈', end: true },
  { path: '/popular', label: '인기 영화' },
  { path: '/upcoming', label: '개봉 예정' },
  { path: '/top-rated', label: '평점 높은' },
  { path: '/now-playing', label: '상영 중' },
]

function Navbar() {
  return (
    <nav className="bg-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center">
        <span className="text-white font-bold text-lg mr-4">🎬 MovieApp</span>
        {navItems.map(({ path, label, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
