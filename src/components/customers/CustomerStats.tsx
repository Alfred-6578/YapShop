import type { Customer } from '@/lib/customers/mockData';
import {
  getOrdersForCustomer,
  getTotalOrderCount,
  getLifetimeValue,
  getAverageOrder,
  getOrderCount,
  getLastOrder,
} from '@/lib/customers/mockData';
import { formatRelative } from '@/lib/utils/format';

type Props = { customer: Customer };

const CustomerStats = ({ customer }: Props) => {
  const orders = getOrdersForCustomer(customer);
  const totalCount = getTotalOrderCount(customer);
  const ltv = getLifetimeValue(customer);
  const avg = getAverageOrder(customer);
  const completedCount = getOrderCount(customer);
  const lastOrder = getLastOrder(customer);

  const byStatus: Record<string, number> = {};
  for (const o of orders) byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
  const breakdownEntries: string[] = [];
  for (const [status, count] of Object.entries(byStatus)) breakdownEntries.push(`${count} ${status}`);
  const breakdown = breakdownEntries.length > 0 ? breakdownEntries.join(' · ') : '—';

  const ltvColor = ltv === 0 ? 'text-fg-subtle' : 'text-fg';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      <div className="bg-card border border-border rounded-[11px] px-3 py-2.5">
        <div className="text-[10px] text-fg-subtle uppercase tracking-wider">Total orders</div>
        <div className="text-[18px] font-medium mt-1 tnum tracking-tight text-fg">{totalCount}</div>
        <div className="text-[10px] text-fg-subtle mt-0.5">{breakdown}</div>
      </div>

      <div className="bg-card border border-border rounded-[11px] px-3 py-2.5">
        <div className="text-[10px] text-fg-subtle uppercase tracking-wider">Lifetime value</div>
        <div className={`text-[18px] font-medium mt-1 tnum tracking-tight ${ltvColor}`}>
          {`₦${ltv.toLocaleString()}`}
        </div>
        <div className="text-[10px] text-fg-subtle mt-0.5">Excludes cancelled</div>
      </div>

      <div className="bg-card border border-border rounded-[11px] px-3 py-2.5">
        <div className="text-[10px] text-fg-subtle uppercase tracking-wider">Avg order</div>
        <div className="text-[18px] font-medium mt-1 tnum tracking-tight text-fg">
          {avg === 0 ? '—' : `₦${avg.toLocaleString()}`}
        </div>
        <div className="text-[10px] text-fg-subtle mt-0.5">{`Across ${completedCount} orders`}</div>
      </div>

      <div className="bg-card border border-border rounded-[11px] px-3 py-2.5">
        <div className="text-[10px] text-fg-subtle uppercase tracking-wider">Last order</div>
        <div className="text-[18px] font-medium mt-1 tnum tracking-tight text-fg">
          {lastOrder ? formatRelative(lastOrder.created_at) : 'Never'}
        </div>
        <div className="text-[10px] text-fg-subtle mt-0.5">{lastOrder?.order_number ?? ''}</div>
      </div>
    </div>
  );
};

export default CustomerStats;
