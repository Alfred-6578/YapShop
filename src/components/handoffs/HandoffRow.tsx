'use client';

import Link from 'next/link';
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineHandRaised,
  HiOutlineUser,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2';
import { LiaRobotSolid } from 'react-icons/lia';
import type { Handoff, HandoffTrigger } from '@/lib/handoffs/mockData';
import { formatDuration } from '@/lib/utils/format';

type Props = {
  handoff: Handoff;
  mode: 'pending' | 'active' | 'resolved';
  onClaim?: (id: string) => void;
};

const TriggerTag = ({ triggered_by }: { triggered_by: HandoffTrigger }) => {
  const base =
    'text-[9.5px] px-1.5 py-0 rounded-[4px] inline-flex items-center gap-1';

  if (triggered_by === 'ai') {
    return (
      <span className={`${base} bg-[rgba(76,141,245,0.16)] text-[#8FB6F5]`}>
        <LiaRobotSolid size={10} />
        AI
      </span>
    );
  }

  if (triggered_by === 'customer') {
    return (
      <span className={`${base} bg-[rgba(245,158,76,0.16)] text-[#F5BD8F]`}>
        <HiOutlineUser size={10} />
        Customer
      </span>
    );
  }

  if (triggered_by === 'staff') {
    return (
      <span className={`${base} bg-[rgba(21,194,106,0.16)] text-[#6FD9A0]`}>
        <HiOutlineUser size={10} />
        Staff
      </span>
    );
  }

  return (
    <span className={`${base} bg-white/[0.08] text-fg-muted`}>
      <HiOutlineCog6Tooth size={10} />
      Rule
    </span>
  );
};

const HandoffRow = ({ handoff, mode, onClaim }: Props) => {
  const requestedMs = new Date(handoff.requested_at).getTime();
  const mins = Math.floor((Date.now() - requestedMs) / 60_000);
  const minsColor =
    mins < 3
      ? 'text-fg-muted'
      : mins <= 10
        ? 'text-[#F0C36B]'
        : 'text-[#F09595]';

  const openLink = (
    <Link
      href={`/conversations/${handoff.conversation_id}`}
      aria-label="Open conversation"
      className="bg-transparent border-[0.5px] border-border rounded-[7px] px-2 py-1.5 text-fg-muted hover:text-fg inline-flex items-center"
    >
      <HiOutlineArrowTopRightOnSquare size={13} />
    </Link>
  );

  return (
    <div className="grid grid-cols-[40px_minmax(0,1fr)_auto_auto] gap-2.5 items-center px-3.5 py-3 hover:bg-white/[0.02] border-b border-white/[0.04] last:border-b-0">
      <div
        className="h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-medium"
        style={{
          backgroundColor: handoff.customer_color,
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        {handoff.customer_initials}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[12.5px] text-fg font-medium">
            {handoff.customer_name}
          </span>
          <span className="font-mono text-[10.5px] text-fg-subtle">
            {handoff.customer_whatsapp}
          </span>
          <TriggerTag triggered_by={handoff.triggered_by} />
        </div>
        <div className="text-[11.5px] text-fg-muted truncate max-w-[330px]">
          {handoff.reason}
        </div>
      </div>

      {mode === 'pending' && (
        <div className="flex flex-col items-end">
          <span className={`text-[13px] font-medium tnum ${minsColor}`}>
            {formatDuration(handoff.requested_at)}
          </span>
          <span className="text-[10px] text-fg-subtle">waiting</span>
        </div>
      )}

      {mode === 'active' && (
        <div className="flex flex-col items-end">
          {handoff.assigned_staff_name ? (
            <span className="text-[12.5px] text-[#6FD9A0] font-medium">
              {handoff.assigned_staff_name}
            </span>
          ) : (
            <span className="text-[12.5px] text-fg-muted">Unassigned</span>
          )}
          {handoff.claimed_at && (
            <span className="text-[10px] text-fg-subtle">
              Since {formatDuration(handoff.claimed_at)}
            </span>
          )}
        </div>
      )}

      {mode === 'resolved' && (
        <div className="flex flex-col items-end">
          <span className="text-[11.5px] text-fg-muted">
            {handoff.assigned_staff_name
              ? `Resolved by ${handoff.assigned_staff_name}`
              : 'Resolved'}
          </span>
          <span className="text-[10px] text-fg-subtle">
            {formatDuration(handoff.requested_at, handoff.resolved_at)} total
          </span>
        </div>
      )}

      {mode === 'pending' ? (
        <div className="flex gap-1">
          {openLink}
          <button
            type="button"
            onClick={() => onClaim?.(handoff.id)}
            className="bg-accent text-accent-fg font-medium text-[11.5px] px-3 py-1.5 rounded-[7px] flex items-center gap-1 hover:bg-accent-hover cursor-pointer"
          >
            <HiOutlineHandRaised size={12} />
            Claim
          </button>
        </div>
      ) : (
        <div className="flex gap-1">{openLink}</div>
      )}
    </div>
  );
};

export default HandoffRow;
