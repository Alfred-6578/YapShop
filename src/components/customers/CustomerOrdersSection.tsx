import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi2';
import Card from '@/components/ui/Card';
import CardHeader from '@/components/ui/CardHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import type { Order } from '@/lib/orders/mockData';

type Props = { orders: Order[] };

const CustomerOrdersSection = ({ orders }: Props) => {
  const sorted = [...orders].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);
  const total = orders.length;

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader title="Orders" meta={<span className="text-[11px] text-fg-muted">0</span>} />
        <div className="py-6 text-center text-[11.5px] text-fg-subtle">No orders yet.</div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Orders"
        meta={
          <div className="flex items-center gap-3 text-[11px] text-fg-muted">
            <span>{total} total</span>
            <Link href="/orders" className="text-[#6FD9A0] hover:underline">View all</Link>
          </div>
        }
      />
      <div className="mt-2">
        {sorted.map((o) => {
          const itemNames = o.items.slice(0, 2).map((it) => it.product_name).join(', ');
          const description = `${o.items.length} items · ${itemNames}`;
          return (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className="grid grid-cols-[88px_minmax(0,1fr)_80px_78px_14px] gap-3 items-center py-2.5 border-t border-white/[0.04] first:border-t-0 hover:bg-white/[0.02]"
            >
              <span className="font-mono text-[11px] text-fg-muted">{o.order_number}</span>
              <span className="text-[11.5px] text-fg-muted truncate">{description}</span>
              <span className={`text-right text-[12px] font-medium tnum ${o.status === 'cancelled' ? 'text-fg-subtle' : 'text-fg'}`}>₦{o.total_amount.toLocaleString()}</span>
              <StatusBadge status={o.status} />
              <HiChevronRight size={12} className="text-fg-subtle justify-self-center" />
            </Link>
          );
        })}
      </div>
    </Card>
  );
};

export default CustomerOrdersSection;
