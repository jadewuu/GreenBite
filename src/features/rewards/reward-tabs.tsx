export type RewardsTab = "points" | "coupons"

type RewardTabsProps = {
  activeTab: RewardsTab
  onChange: (tab: RewardsTab) => void
}

export function RewardTabs({ activeTab, onChange }: RewardTabsProps) {
  const tabs: { id: RewardsTab; label: string; accessibilityLabel?: string }[] = [
    { id: "coupons", label: "Coupon", accessibilityLabel: "Coupons" },
    { id: "points", label: "Lunch Item", accessibilityLabel: "Points" },
    { id: "points", label: "Base Item" },
    { id: "points", label: "Drinks" },
    { id: "points", label: "Mini Bowlo" },
  ]

  return (
    <div aria-label="Rewards sections" className="reward-tabs" role="tablist">
      {tabs.map((item, index) => (
        <button
          aria-label={item.accessibilityLabel}
          aria-selected={activeTab === item.id && (item.id === "coupons" || index === 1)}
          className="reward-tab"
          key={`${item.label}-${index}`}
          onClick={() => onChange(item.id)}
          role="tab"
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
