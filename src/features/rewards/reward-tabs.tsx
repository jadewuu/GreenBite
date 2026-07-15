type RewardsTab = "points" | "coupons"

type RewardTabsProps = {
  activeTab: RewardsTab
  onChange: (tab: RewardsTab) => void
}

export function RewardTabs({ activeTab, onChange }: RewardTabsProps) {
  return (
    <div aria-label="Rewards sections" className="reward-tabs" role="tablist">
      <button
        aria-selected={activeTab === "points"}
        className="reward-tab"
        onClick={() => onChange("points")}
        role="tab"
        type="button"
      >
        Points
      </button>
      <button
        aria-selected={activeTab === "coupons"}
        className="reward-tab"
        onClick={() => onChange("coupons")}
        role="tab"
        type="button"
      >
        Coupons
      </button>
    </div>
  )
}
