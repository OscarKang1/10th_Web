import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import MovieListPage from './pages/MovieListPage'
import MovieDetailPage from './pages/MovieDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/popular" replace />} />
        <Route path="popular" element={<MovieListPage category="popular" title="인기 영화" />} />
        <Route path="upcoming" element={<MovieListPage category="upcoming" title="개봉 예정" />} />
        <Route path="top-rated" element={<MovieListPage category="top_rated" title="평점 높은" />} />
        <Route path="now-playing" element={<MovieListPage category="now_playing" title="상영 중" />} />
        <Route path="movies/:movieId" element={<MovieDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
