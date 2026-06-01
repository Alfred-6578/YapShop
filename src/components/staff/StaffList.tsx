import Link from 'next/link'
import Card from '@/components/ui/Card'
import StatusBadge from '@/components/ui/StatusBadge'
import { getActiveHandoffCount, type Staff } from '@/lib/staff/mockData'

type Props = {
  staff: Staff[]
  currentUserId: string
  emptyState?: React.ReactNode
}

const StaffList = ({ staff, currentUserId, emptyState }: Props) => {
  if (staff.length === 0) {
    return <Card padded={false}>{emptyState ?? null}</Card>
  }

  return (
    <Card padded={false}>
      {staff.map((s) => {
        const ownerRing =
          s.role === 'owner'
            ? { boxShadow: '0 0 0 1.5px rgba(21,194,106,0.25)' }
            : {}
        const initialsColor = s.is_active ? 'rgba(255,255,255,0.85)' : '#989DA3'
        const nameColor = s.is_active ? 'text-fg' : 'text-[#989DA3]'
        const metaColor = s.is_active ? 'text-fg-muted' : 'text-[#676C72]'
        const isMe = s.id === currentUserId
        const count = getActiveHandoffCount(s)
        const dotColor = count > 0 ? '#F0A92B' : '#3A3D44'
        const workloadTextColor = count > 0 ? 'text-[#F0C36B]' : 'text-fg-muted'
        const roleClass =
          s.role === 'owner'
            ? 'bg-accent text-accent-fg font-medium'
            : s.role === 'admin'
              ? 'bg-[rgba(76,141,245,0.18)] text-[#8FB6F5]'
              : 'bg-white/[0.08] text-[#B8BDC4]'
        const roleOpacity = s.is_active ? '' : 'opacity-50'
        const roleLabel =
          s.role === 'owner' ? 'Owner' : s.role === 'admin' ? 'Admin' : 'Support'

        return (
          <Link
            key={s.id}
            href={`/staff/${s.id}/edit`}
            className="grid grid-cols-[40px_minmax(0,1fr)_auto_auto_auto] gap-2.5 items-center px-3.5 py-3 hover:bg-white/[0.02] border-b border-white/[0.04] last:border-b-0"
          >
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-medium"
              style={{
                backgroundColor: s.thumbnail_color,
                color: initialsColor,
                ...ownerRing,
              }}
            >
              {s.initials}
            </div>

            <div className="min-w-0">
              <div className="flex items-center">
                <span className={`text-[12.5px] font-medium ${nameColor}`}>
                  {s.name}
                </span>
                {isMe && (
                  <span className="text-[10px] text-fg-subtle italic ml-1">
                    (you)
                  </span>
                )}
              </div>
              <div
                className={`text-[11px] truncate max-w-[340px] ${metaColor}`}
              >
                {s.email}
                {s.phone_number && (
                  <>
                    <span className="text-[#3D4046]"> · </span>
                    {s.phone_number}
                  </>
                )}
              </div>
            </div>

            {!s.is_active ? (
              <span className="text-[10.5px] text-fg-subtle">—</span>
            ) : (
              <span
                className={`text-[10.5px] flex items-center gap-1 ${workloadTextColor}`}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: dotColor }}
                />
                {count} active
              </span>
            )}

            <span
              className={`text-[10px] px-2 py-0.5 rounded-[6px] whitespace-nowrap ${roleClass} ${roleOpacity}`}
            >
              {roleLabel}
            </span>

            <StatusBadge status={s.is_active ? 'active' : 'inactive'} />
          </Link>
        )
      })}
    </Card>
  )
}

export default StaffList
