import { ref, computed } from 'vue'

export function usePagination(dataRef, defaultPageSize = 10) {
  const currentPage = ref(1)
  const pageSize = ref(defaultPageSize)

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return dataRef.value.slice(start, start + pageSize.value)
  })

  const handlePageChange = (val) => {
    currentPage.value = val
  }

  const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1
  }

  return {
    currentPage,
    pageSize,
    paginatedData,
    handlePageChange,
    handleSizeChange,
  }
}
