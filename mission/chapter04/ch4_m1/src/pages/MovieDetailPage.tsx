import { useParams, useNavigate, Link } from 'react-router-dom'
import Spinner from '../components/Spinner'
import ProfileImage from '../components/ProfileImage'
import useCustomFetch from '../hooks/useCustomFetch'
import { type MovieDetails, type Credits, type CastMember, type CrewMember } from '../types/movie'

const BASE_URL = 'https://api.themoviedb.org/3/movie'
const LANG = { language: 'ko-KR' }

function formatRuntime(minutes: number | null): string {
  if (!minutes) return '정보 없음'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`
}

function formatMoney(amount: number): string {
  if (amount === 0) return '정보 없음'
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>()
  const navigate = useNavigate()

  // movieId가 바뀌면 두 훅 모두 자동으로 재요청
  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
  } = useCustomFetch<MovieDetails>(movieId ? `${BASE_URL}/${movieId}` : null, LANG)

  const {
    data: credits,
    isLoading: creditsLoading,
    error: creditsError,
  } = useCustomFetch<Credits>(movieId ? `${BASE_URL}/${movieId}/credits` : null, LANG)

  const isLoading = movieLoading || creditsLoading
  const error = movieError || creditsError

  if (isLoading) return <Spinner />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-6xl">😢</p>
        <p className="text-red-400 text-xl font-semibold">오류가 발생했습니다</p>
        <p className="text-gray-500 text-sm bg-gray-800 px-4 py-2 rounded-lg">{error}</p>
        <Link
          to="/"
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  if (!movie || !credits) return null

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null

  const directors: CrewMember[] = credits.crew.filter((c) => c.job === 'Director')
  const topCast: CastMember[] = credits.cast.slice(0, 12)

  const KEY_CREW_JOBS = ['Director', 'Producer', 'Screenplay', 'Original Music Composer', 'Director of Photography']

  return (
    <div className="text-white">
      {/* 백드롭 배너 */}
      <div className="relative -mx-6 -mt-10 mb-8 h-80 overflow-hidden">
        {backdropUrl ? (
          <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
      </div>

      {/* 메인 정보 영역 */}
      <div className="flex flex-col md:flex-row gap-8 -mt-32 relative z-10 mb-10">
        {/* 포스터 */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-48 rounded-2xl shadow-2xl ring-2 ring-gray-700"
            />
          ) : (
            <div className="w-48 h-72 bg-gray-700 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-gray-400 text-sm">이미지 없음</span>
            </div>
          )}
        </div>

        {/* 텍스트 정보 */}
        <div className="flex-1 flex flex-col gap-3">
          <h1 className="text-4xl font-bold leading-tight">{movie.title}</h1>

          {movie.tagline && (
            <p className="text-blue-400 italic text-sm">"{movie.tagline}"</p>
          )}

          {/* 배지들 */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 text-sm font-semibold px-3 py-1 rounded-full">
              ★ {movie.vote_average.toFixed(1)}
              <span className="text-gray-400 font-normal text-xs">
                ({movie.vote_count.toLocaleString()}명)
              </span>
            </span>
            <span className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full">
              {movie.release_date?.slice(0, 4)}
            </span>
            <span className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full">
              {formatRuntime(movie.runtime)}
            </span>
            <span className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full uppercase">
              {movie.original_language}
            </span>
          </div>

          {/* 장르 */}
          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="bg-blue-600/30 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-600/40"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* 줄거리 */}
          <div>
            <h2 className="text-lg font-semibold mb-1">줄거리</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {movie.overview || '줄거리 정보가 없습니다.'}
            </p>
          </div>

          {/* 감독 */}
          {directors.length > 0 && (
            <p className="text-sm text-gray-400">
              <span className="text-white font-semibold">감독: </span>
              {directors.map((d) => d.name).join(', ')}
            </p>
          )}

          {/* 제작비/수익 */}
          <div className="flex flex-wrap gap-6 text-sm mt-1">
            <div>
              <span className="text-gray-400">제작비 </span>
              <span className="text-white font-medium">{formatMoney(movie.budget)}</span>
            </div>
            <div>
              <span className="text-gray-400">수익 </span>
              <span className="text-white font-medium">{formatMoney(movie.revenue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 출연진 섹션 */}
      {topCast.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">주요 출연진</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topCast.map((actor) => (
              <div key={actor.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-md">
                <ProfileImage path={actor.profile_path} name={actor.name} size="md" />
                <div className="p-2">
                  <p className="text-white text-xs font-semibold leading-tight truncate">{actor.name}</p>
                  <p className="text-gray-400 text-xs truncate">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 제작진 섹션 */}
      {credits.crew.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">주요 제작진</h2>
          <div className="flex flex-col gap-3">
            {KEY_CREW_JOBS
              .flatMap((job) =>
                credits.crew
                  .filter((c) => c.job === job)
                  .map((c) => ({ ...c, jobLabel: job }))
              )
              .filter((c, idx, arr) => arr.findIndex((x) => x.id === c.id && x.job === c.job) === idx)
              .map((crew) => (
                <div
                  key={`${crew.id}-${crew.job}`}
                  className="flex items-center gap-3 bg-gray-800/60 rounded-xl px-4 py-3"
                >
                  <ProfileImage path={crew.profile_path} name={crew.name} size="sm" />
                  <div>
                    <p className="text-white text-sm font-semibold">{crew.name}</p>
                    <p className="text-blue-400 text-xs">{crew.job}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* 뒤로가기 */}
      <div className="mt-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← 목록으로 돌아가기
        </button>
      </div>
    </div>
  )
}

export default MovieDetailPage
