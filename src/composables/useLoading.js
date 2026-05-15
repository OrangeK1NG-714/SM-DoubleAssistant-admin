import { ref } from 'vue'

export function useLoading(fn) {
  const loading = ref(false)

  const run = async (...args) => {
    loading.value = true
    try {
      return await fn(...args)
    } finally {
      loading.value = false
    }
  }

  return { run, loading }
}
