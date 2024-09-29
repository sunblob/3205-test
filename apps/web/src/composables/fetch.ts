import { type Ref, ref } from 'vue'

interface FetchResponse<T> {
  data: Ref<T | undefined>
  isPending: Ref<boolean>
}

export async function useFetch<T>(
  url: string | URL,
  options?: RequestInit
): Promise<FetchResponse<T>> {
  const isPending = ref(false)
  const data = ref<T>()

  try {
    isPending.value = true
    const response = await fetch(url, { ...options })

    if (response.ok) {
      console.log('response', response)

      data.value = await response.json()
    }
  } catch (err) {
    console.log('Error', err)
  } finally {
    isPending.value = false
  }

  return {
    data,
    isPending
  }
}
