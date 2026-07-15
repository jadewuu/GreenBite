type RewardsTab = "rewards" | "coupons"

type RewardTabsProps = {
  activeTab: RewardsTab
  onChange: (tab: RewardsTab) => void
}

export function RewardTabs({ activeTab, onChange }: RewardTabsProps) {
  return (
    <div aria-label="Rewards sections" className="reward-tabs" role="tablist">
      <button
        aria-selected={activeTab === "rewards"}
        className="reward-tab"
        onClick={() => onChange("rewards")}
        role="tab"
        type="button"
      >
        Rewards
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
