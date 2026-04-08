import { useEffect, useState } from 'react'

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN as string

function useCustomFetch<T>(url: string | null, params?: Record<string, string>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // params를 안정적인 string으로 변환 → 의존성 배열에서 깊은 비교 역할
  const paramsString = params ? new URLSearchParams(params).toString() : ''

  useEffect(() => {
    if (!url) return

    const fullUrl = paramsString ? `${url}?${paramsString}` : url
    const controller = new AbortController()

    setIsLoading(true)
    setError(null)

    fetch(fullUrl, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류가 발생했습니다. (${res.status})`)
        return res.json() as Promise<T>
      })
      .then((json) => setData(json))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
        }
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [url, paramsString])

  return { data, isLoading, error }
}

export default useCustomFetch
