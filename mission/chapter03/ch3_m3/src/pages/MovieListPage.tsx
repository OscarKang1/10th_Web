import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import Spinner from '../components/Spinner'
import { type Movie, type MovieResponse } from '../types/movie'

const API_KEY = '8f3fb5ced7bad77c121296eca926be47'
const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZjNmYjVjZWQ3YmFkNzdjMTIxMjk2ZWNhOTI2YmU0NyIsIm5iZiI6MTc3NTA0NDczMC4zMDQ5OTk4LCJzdWIiOiI2OWNkMDg3YWRmMWNkMDhlOTA0OGYwNTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.GmW1VmAEQBiJGmPrL8edE5tS6Xyg0dVRGIECGMynODE'

type Props = {
  category: string
  title: string
}

function MovieListPage({ category, title }: Props) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        )
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        const data: MovieResponse = await res.json()
        setMovies(data.results)
        setTotalPages(data.total_pages)
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [category, page])

  // 카테고리가 바뀌면 페이지를 1로 초기화
  useEffect(() => {
    setPage(1)
  }, [category])

  if (isLoading) return <Spinner />

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-400 text-xl">오류: {error}</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white text-center mb-8">{title}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="px-6 py-2 rounded-lg bg-gray-700 text-white font-medium transition-colors
            hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          이전
        </button>

        <span className="text-gray-300 text-sm">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
          className="px-6 py-2 rounded-lg bg-gray-700 text-white font-medium transition-colors
            hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>
  )
}

export default MovieListPage
