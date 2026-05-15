import { ref } from 'vue'

export function useDateRange(form, startKey, endKey) {
  const dateRange = ref([])

  const handleDateChange = (val) => {
    if (val && val.length === 2) {
      form[startKey] = val[0]
      form[endKey] = val[1]
    } else {
      form[startKey] = ''
      form[endKey] = ''
    }
  }

  return {
    dateRange,
    handleDateChange,
  }
}
