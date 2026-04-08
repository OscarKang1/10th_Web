import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import Spinner from '../components/Spinner'
import useCustomFetch from '../hooks/useCustomFetch'
import { type MovieResponse } from '../types/movie'

const BASE_URL = 'https://api.themoviedb.org/3/movie'

type Props = {
  category: string
  title: string
}

function MovieListPage({ category, title }: Props) {
  const [page, setPage] = useState(1)

  // category가 바뀌면 페이지를 1로 초기화
  useEffect(() => {
    setPage(1)
  }, [category])

  // URL 또는 params(page) 변경 시 useCustomFetch가 자동으로 재요청
  const { data, isLoading, error } = useCustomFetch<MovieResponse>(
    `${BASE_URL}/${category}`,
    { language: 'ko-KR', page: String(page) },
  )

  const movies = data?.results ?? []
  const totalPages = data?.total_pages ?? 1

  if (isLoading) return <Spinner />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-6xl">🎬</p>
        <p className="text-red-400 text-xl font-semibold">영화 목록을 불러올 수 없어요</p>
        <p className="text-gray-500 text-sm bg-gray-800 px-4 py-2 rounded-lg">{error}</p>
      </div>
    )
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
        <p className="text-gray-500 text-sm">{totalPages * 20}편 이상의 영화</p>
      </div>

      {/* 영화 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="px-5 py-2 rounded-lg bg-gray-800 text-white font-medium border border-gray-700
            hover:bg-gray-700 hover:border-gray-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← 이전
        </button>

        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-5 py-2">
          <span className="text-white font-bold text-sm">{page}</span>
          <span className="text-gray-500 text-sm">/</span>
          <span className="text-gray-400 text-sm">{totalPages}</span>
        </div>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
          className="px-5 py-2 rounded-lg bg-gray-800 text-white font-medium border border-gray-700
            hover:bg-gray-700 hover:border-gray-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          다음 →
        </button>
      </div>
    </div>
  )
}

export default MovieListPage
