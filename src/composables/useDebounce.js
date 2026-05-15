import { ref } from 'vue'

export function useDebounce(fn, delay = 800) {
  const loading = ref(false)

  const run = async (...args) => {
    if (loading.value) return
    loading.value = true
    try {
      await fn(...args)
    } finally {
      setTimeout(() => {
        loading.value = false
      }, delay)
    }
  }

  return { run, loading }
}
