import { useEffect, useState } from 'react'
import './index.css'
import MovieCard from './components/MovieCard'
import { type Movie, type MovieResponse } from './types/movie'

const API_KEY = '8f3fb5ced7bad77c121296eca926be47'
const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZjNmYjVjZWQ3YmFkNzdjMTIxMjk2ZWNhOTI2YmU0NyIsIm5iZiI6MTc3NTA0NDczMC4zMDQ5OTk4LCJzdWIiOiI2OWNkMDg3YWRmMWNkMDhlOTA0OGYwNTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.GmW1VmAEQBiJGmPrL8edE5tS6Xyg0dVRGIECGMynODE'

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        return res.json()
      })
      .then((data: MovieResponse) => {
        console.log('영화 데이터:', data.results)
        setMovies(data.results)
        setLoading(false)
      })
      .catch((err) => {
        console.error('API 오류:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-400 text-xl">오류: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        인기 영화
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

export default App
