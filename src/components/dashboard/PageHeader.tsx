"use client"
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa6'
import { useClickOutside } from '@/hooks/useClickOutside'

const dateRanges = ['Today', 'This Week', 'This Month', 'This Year']

type Props = {
  header: string
  subheader: string
  dateSelector?: boolean
}

const PageHeader = ({ header, subheader, dateSelector = false }: Props) => {
  const [selected, setSelected] = useState('Today')
  const [open, setOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(open, () => setOpen(false))

  const pick = (range: string) => {
    setSelected(range)
    setOpen(false)
  }

  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold">{header}</h1>
        <p className="text-fg-muted">{subheader}</p>
      </div>
      {dateSelector && (
        <div ref={ref} className="relative text-[15px] w-32">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center justify-between w-full border border-border-strong cursor-pointer bg-card hover:bg-card-hover rounded-control p-1.5 px-2.5"
          >
            <span>{selected}</span>
            <FaChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border-strong rounded-control shadow-lg z-20 overflow-hidden">
              {dateRanges.map(
                (range) =>
                  range !== selected && (
                    <button
                      key={range}
                      type="button"
                      onClick={() => pick(range)}
                      className="w-full text-left cursor-pointer hover:bg-card-hover px-2.5 py-1.5"
                    >
                      {range}
                    </button>
                  ),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PageHeader
