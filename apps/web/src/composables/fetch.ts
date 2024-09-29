import { type Ref, ref } from 'vue'

interface FetchResponse<T> {
  data: Ref<T | undefined>
  isPending: Ref<boolean>
  execute: (url: string | URL, options?: Omit<RequestInit, 'signal'>) => void
  abort: (reason?: any) => void
}

export function useFetch<T>(): FetchResponse<T> {
  const isPending = ref(false)
  const data = ref<T>()
  const controller = new AbortController()
  const signal = controller.signal

  async function execute(url: string | URL, options?: RequestInit) {
    try {
      isPending.value = true
      const response = await fetch(url, { ...options, signal })

      if (response.ok) {
        data.value = await response.json()
      }
    } catch (err) {
      console.log('Error', err)
    } finally {
      isPending.value = false
    }
  }

  function abort(reason?: any) {
    controller.abort(reason)
  }

  return {
    execute,
    data,
    isPending,
    abort
  }
}
