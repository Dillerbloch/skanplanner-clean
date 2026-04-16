import React, { createContext, useContext, useState } from 'react'

const TabsContext = createContext(null)

export function Tabs({ defaultValue, children, className = '' }) {
  const [value, setValue] = useState(defaultValue)
  return <TabsContext.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsContext.Provider>
}

export function TabsList({ className = '', children }) {
  return <div className={className}>{children}</div>
}

export function TabsTrigger({ value, className = '', children }) {
  const ctx = useContext(TabsContext)
  const active = ctx?.value === value
  return (
    <button
      type="button"
      onClick={() => ctx?.setValue(value)}
      className={`${className} px-3 py-2 text-sm ${active ? 'bg-slate-900 text-white' : 'text-slate-700'}`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }) {
  const ctx = useContext(TabsContext)
  if (ctx?.value !== value) return null
  return <div>{children}</div>
}
