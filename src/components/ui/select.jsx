import React, { createContext, useContext } from 'react'

const SelectContext = createContext(null)

export function Select({ value, onValueChange, children }) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ className = '', children }) {
  return <div className={className}>{children}</div>
}

export function SelectValue() {
  const ctx = useContext(SelectContext)
  return <span>{ctx?.value}</span>
}

export function SelectContent({ children, className = '' }) {
  const ctx = useContext(SelectContext)
  return (
    <select
      value={ctx?.value}
      onChange={(e) => ctx?.onValueChange?.(e.target.value)}
      className={`flex h-10 w-full border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${className}`}
    >
      {children}
    </select>
  )
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>
}
