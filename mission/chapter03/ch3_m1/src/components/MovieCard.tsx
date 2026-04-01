import { type Movie } from '../types/movie'

function MovieCard({ movie }: { movie: Movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null

  return (
    <div className="relative group rounded-xl overflow-hidden shadow-lg cursor-pointer">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-72 object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-72 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400 text-sm">이미지 없음</span>
        </div>
      )}

      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h2 className="text-white font-bold text-sm leading-tight mb-1">
          {movie.title}
        </h2>
        <p className="text-gray-300 text-xs line-clamp-4 leading-relaxed">
          {movie.overview || '줄거리 정보가 없습니다.'}
        </p>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-white text-xs">{movie.vote_average.toFixed(1)}</span>
          <span className="text-gray-400 text-xs ml-auto">{movie.release_date?.slice(0, 4)}</span>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
