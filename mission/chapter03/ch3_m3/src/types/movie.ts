export type Movie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  vote_average: number
  release_date: string
}

export type MovieResponse = {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetails {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date: string
  runtime: number | null
  genres: Genre[]
  tagline: string | null
  status: string
  original_language: string
  budget: number
  revenue: number
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Credits {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}
