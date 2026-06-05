import type { CustomerResponse } from "@/lib/api/types"
import { getDisplayName, getSecondaryName } from "@/lib/customers/utils"

interface Props {
  customer: CustomerResponse
  /**
   * Applied to the outer wrapper span. Use for tone/color (e.g.
   * `text-fg`) — weight is owned by the component (primary is bold,
   * secondary is muted/smaller).
   */
  className?: string
}

/**
 * Renders a customer's name as **Primary** (Secondary) — primary in semibold,
 * secondary smaller and dimmed in parentheses. Drops the parenthetical when
 * the customer has only one of the two fields, or both fields are identical.
 *
 * Secondary uses `text-[0.85em]` so it scales with the parent font-size
 * rather than locking to a pixel value — works in 11px breadcrumbs and 18px
 * page headers alike.
 */
export default function CustomerNameLabel({ customer, className = "" }: Props) {
  const primary = getDisplayName(customer)
  const secondary = getSecondaryName(customer)

  return (
    <span className={className}>
      <span className="font-medium">{primary}</span>
      {secondary && (
        <span className="text-fg-subtle text-[0.85em] ml-1 font-normal">
          ({secondary})
        </span>
      )}
    </span>
  )
}
