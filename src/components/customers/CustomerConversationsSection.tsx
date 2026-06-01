import Link from 'next/link';
import { HiOutlineExclamationCircle, HiOutlineChatBubbleOvalLeft } from 'react-icons/hi2';
import Card from '@/components/ui/Card';
import CardHeader from '@/components/ui/CardHeader';
import { formatRelative } from '@/lib/utils/format';
import type { Conversation } from '@/lib/conversations/mockData';

type Props = { conversations: Conversation[] };

const CustomerConversationsSection = ({ conversations }: Props) => {
  const sorted = [...conversations]
    .sort((a, b) => b.last_message_at.localeCompare(a.last_message_at))
    .slice(0, 3);
  const total = conversations.length;
  const activeCount = conversations.filter((c) => c.status === 'active').length;

  const header = (
    <CardHeader
      title="Conversations"
      meta={
        <div className="flex items-center gap-3 text-[11px] text-fg-muted">
          <span>
            {total} total · {activeCount} active
          </span>
          <Link href="/conversations" className="text-[#6FD9A0] hover:underline">
            View all
          </Link>
        </div>
      }
    />
  );

  if (conversations.length === 0) {
    return (
      <Card>
        {header}
        <div className="py-6 text-center text-[11.5px] text-fg-subtle">No conversations yet.</div>
      </Card>
    );
  }

  return (
    <Card>
      {header}
      <div>
        {sorted.map((c) => {
          let iconBg: string;
          let icon: React.ReactNode;
          if (c.handoff_status === 'requested') {
            iconBg = 'bg-[rgba(240,169,43,0.16)] text-[#F0C36B]';
            icon = <HiOutlineExclamationCircle size={16} />;
          } else if (c.status === 'ended') {
            iconBg = 'bg-[rgba(107,112,121,0.16)] text-[#989DA3]';
            icon = <HiOutlineChatBubbleOvalLeft size={16} />;
          } else {
            iconBg = 'bg-[rgba(76,141,245,0.16)] text-[#8FB6F5]';
            icon = <HiOutlineChatBubbleOvalLeft size={16} />;
          }

          const title =
            c.last_message_preview.length > 30
              ? c.last_message_preview.slice(0, 30) + '…'
              : c.last_message_preview;

          let subtitle: string;
          if (c.handoff_status === 'requested') subtitle = 'AI escalated';
          else if (c.status === 'ended' && c.assigned_staff_name)
            subtitle = `resolved by ${c.assigned_staff_name}`;
          else if (c.handoff_status === 'active' && c.assigned_staff_name)
            subtitle = `${c.assigned_staff_name} handling`;
          else if (c.status === 'ended') subtitle = 'ended';
          else subtitle = 'AI handling';

          return (
            <Link
              key={c.id}
              href={`/conversations/${c.id}`}
              className="grid grid-cols-[40px_minmax(0,1fr)_auto] gap-3 items-center py-2.5 border-t border-white/[0.04] first:border-t-0 hover:bg-white/[0.02]"
            >
              <div
                className={`h-9 w-9 rounded-full inline-flex items-center justify-center ${iconBg}`}
              >
                {icon}
              </div>
              <div className="min-w-0">
                <div className="text-[12px] text-fg font-medium truncate">{title}</div>
                <div className="text-[11px] text-fg-muted truncate max-w-[280px] mt-0.5">
                  — {subtitle}
                </div>
              </div>
              <span className="text-[10.5px] text-fg-subtle">
                {formatRelative(c.last_message_at)}
              </span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};

export default CustomerConversationsSection;
