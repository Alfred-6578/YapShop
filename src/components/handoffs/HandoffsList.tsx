import Card from '@/components/ui/Card';
import HandoffRow from './HandoffRow';
import type { Handoff } from '@/lib/handoffs/mockData';
import { HiOutlineCheck, HiOutlinePause, HiOutlineClock } from 'react-icons/hi2';

type Props = {
  handoffs: Handoff[];
  mode: 'pending' | 'active' | 'resolved';
  onClaim?: (id: string) => void;
};

const HandoffsList = ({ handoffs, mode, onClaim }: Props) => {
  const iconByMode =
    mode === 'pending' ? (
      <HiOutlineCheck size={24} className="text-[#6FD9A0]" />
    ) : mode === 'active' ? (
      <HiOutlinePause size={24} className="text-fg-subtle" />
    ) : (
      <HiOutlineClock size={24} className="text-fg-subtle" />
    );

  const textByMode =
    mode === 'pending'
      ? 'All caught up — no customers waiting'
      : mode === 'active'
        ? 'No active handoffs'
        : 'No resolved handoffs in this period';

  return (
    <Card padded={false}>
      {handoffs.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-2">
          {iconByMode}
          <p className="text-[12px] text-fg-muted">{textByMode}</p>
        </div>
      ) : (
        handoffs.map((h) => (
          <HandoffRow key={h.id} handoff={h} mode={mode} onClaim={onClaim} />
        ))
      )}
    </Card>
  );
};

export default HandoffsList;
