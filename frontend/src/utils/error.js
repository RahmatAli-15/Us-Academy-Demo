export const extractErrorMessage = (error) => {
  const detail = error?.response?.data?.detail

  if (Array.isArray(detail) && detail.length > 0) {
    return detail[0]?.msg || 'Something went wrong'
  }

  if (typeof detail === 'string' && detail.trim()) {
    return detail
  }

  return 'Something went wrong'
}
