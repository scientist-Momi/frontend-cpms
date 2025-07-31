export function useFunction() {

  function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  function formatDateLong(date) {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function formatDateShort(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  function formatCurrency(value) {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return '£' + num.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  function getCustomerInitials(name) {
    if (!name) return ''
    const parts = name.trim().split(/\s+/).filter(Boolean)
    const initials = parts.map((part) => part[0].toUpperCase()).join('')
    return initials
  }

  return { formatDate, formatCurrency, formatDateShort, getCustomerInitials, formatDateLong }
}
