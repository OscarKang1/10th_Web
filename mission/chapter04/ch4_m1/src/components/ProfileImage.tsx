type Props = {
  path: string | null
  name: string
  size?: 'sm' | 'md'
}

function ProfileImage({ path, name, size = 'md' }: Props) {
  const sizeClass = size === 'sm' ? 'w-12 h-12' : 'w-16 h-24'
  if (path) {
    return (
      <img
        src={`https://image.tmdb.org/t/p/w185${path}`}
        alt={name}
        className={`${sizeClass} object-cover rounded-lg flex-shrink-0`}
      />
    )
  }
  return (
    <div className={`${sizeClass} bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0`}>
      <span className="text-gray-400 text-xs text-center px-1">사진 없음</span>
    </div>
  )
}

export default ProfileImage
