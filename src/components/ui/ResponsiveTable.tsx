"use client"
import React from 'react'

export type Column<T> = {
  key: string
  header: string
  align?: 'left' | 'right' | 'center'
  className?: string
  /** Hide this column at the given breakpoint and below. */
  mobile?: 'hidden'
  render: (row: T) => React.ReactNode
}

type Props<T> = {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  empty?: React.ReactNode
  className?: string
}

const alignClass = (a?: 'left' | 'right' | 'center') =>
  a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left'

const ResponsiveTable = <T,>({
  columns,
  data,
  rowKey,
  onRowClick,
  empty,
  className = '',
}: Props<T>) => {
  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-fg-muted">
        {empty ?? 'Nothing here yet'}
      </div>
    )
  }

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-fg-muted">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`font-normal py-2 px-3 first:pl-0 last:pr-0 ${alignClass(col.align)} ${col.mobile === 'hidden' ? 'hidden md:table-cell' : ''} ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={`border-t border-border ${onRowClick ? 'cursor-pointer hover:bg-card-hover' : ''}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-3 first:pl-0 last:pr-0 ${alignClass(col.align)} ${col.mobile === 'hidden' ? 'hidden md:table-cell' : ''} ${col.className ?? ''}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResponsiveTable
