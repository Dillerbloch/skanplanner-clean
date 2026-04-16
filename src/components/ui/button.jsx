import React from 'react'

export function Button({ className = '', variant = 'default', ...props }) {
  const variantClass = variant === 'outline'
    ? 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
    : 'bg-slate-900 text-white hover:bg-slate-800'
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${variantClass} ${className}`}
      {...props}
    />
  )
}
