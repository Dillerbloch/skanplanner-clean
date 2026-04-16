import React from 'react'

export function Badge({ className = '', variant = 'default', ...props }) {
  const variantClass = variant === 'outline'
    ? 'border border-slate-300 text-slate-700 bg-white'
    : 'bg-slate-900 text-white'
  return <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold ${variantClass} ${className}`} {...props} />
}
