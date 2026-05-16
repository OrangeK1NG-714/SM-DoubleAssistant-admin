import { ref, watch, nextTick } from 'vue'

export function useTableSelection(tableRef, paginatedData, currentPage, pageSize) {
  const selectedItems = ref([])

  const handleSelect = (selection, row) => {
    if (selection.includes(row)) {
      if (!selectedItems.value.some(item => item._id === row._id)) {
        selectedItems.value.push(row)
      }
    } else {
      selectedItems.value = selectedItems.value.filter(item => item._id !== row._id)
    }
  }

  const handleSelectAll = (selection) => {
    if (selection.length > 0) {
      paginatedData.value.forEach(row => {
        if (!selectedItems.value.some(item => item._id === row._id)) {
          selectedItems.value.push(row)
        }
      })
    } else {
      const currentPageIds = paginatedData.value.map(item => item._id)
      selectedItems.value = selectedItems.value.filter(
        item => !currentPageIds.includes(item._id)
      )
    }
  }

  watch([currentPage, pageSize], () => {
    nextTick(() => {
      if (!tableRef.value) return
      paginatedData.value.forEach(row => {
        const isSelected = selectedItems.value.some(item => item._id === row._id)
        tableRef.value.toggleRowSelection(row, isSelected)
      })
    })
  })

  const clearSelection = () => {
    selectedItems.value = []
    nextTick(() => {
      tableRef.value?.clearSelection()
    })
  }

  const selectAllItems = (allData) => {
    selectedItems.value = [...allData]
    nextTick(() => {
      if (!tableRef.value) return
      paginatedData.value.forEach(row => {
        tableRef.value.toggleRowSelection(row, true)
      })
    })
  }

  return {
    selectedItems,
    handleSelect,
    handleSelectAll,
    clearSelection,
    selectAllItems,
  }
}
