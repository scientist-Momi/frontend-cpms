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

  function formatCurrencyTrans(value) {
    if (value == null || isNaN(value)) return '£0.00'
    const num = typeof value === 'string' ? parseFloat(value) : value
    return '£' + num.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }


  function getCustomerInitials(name) {
    if (!name) return ''
    const parts = name.trim().split(/\s+/).filter(Boolean)
    const initials = parts.map((part) => part[0].toUpperCase()).join('')
    return initials
  }

  function formatDateLongWithTimeBy(date) {
    if (!date) return ''
    const d = new Date(date)
    const dateStr = d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    return `${dateStr} by ${timeStr}`
  }

  return {
    formatDate,
    formatCurrency,
    formatDateShort,
    getCustomerInitials,
    formatDateLong,
    formatDateLongWithTimeBy,
    formatCurrencyTrans,
  }
}
