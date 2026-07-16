import { useEffect, useState } from "react"

import pointsArrow from "@/assets/figma-clean/details/points-arrow-left.svg"
import { rewardsApi } from "@/lib/api/rewards-api"
import type { PointActivity } from "@/lib/api/types"

import { DetailHeader } from "./detail-header"

type ActivityGroup = { label: string; rows: PointActivity[] }

function groupActivities(activities: PointActivity[]) {
  return activities.reduce<ActivityGroup[]>((groups, activity) => {
    const group = groups.find((item) => item.label === activity.monthLabel)
    if (group) group.rows.push(activity)
    else groups.push({ label: activity.monthLabel, rows: [activity] })
    return groups
  }, [])
}

export function Points({ onBack }: { onBack: () => void }) {
  const [activities, setActivities] = useState<PointActivity[] | null>(null)

  useEffect(() => {
    let active = true
    void rewardsApi.getActivities().then((nextActivities) => {
      if (active) setActivities(nextActivities)
    })
    return () => { active = false }
  }, [])

  if (!activities) return <main aria-busy="true" className="figma-frame detail-frame-clean" />

  const groups = groupActivities(activities)

  return (
    <main className="figma-frame detail-frame-clean points-clean" data-figma-node="42:2853">
      <DetailHeader arrow={pointsArrow} onBack={onBack} title="Points" />
      <div className="points-ledger-clean">
        {groups.map((group) => <PointMonth key={group.label} label={group.label} rows={group.rows} />)}
      </div>
    </main>
  )
}

function PointMonth({ label, rows }: ActivityGroup) {
  return (
    <section aria-label={label} className="points-month-clean">
      <h2>{label}</h2>
      {rows.map((row) => <PointRow key={row.id} row={row} />)}
    </section>
  )
}

function PointRow({ row }: { row: PointActivity }) {
  return (
    <article className="point-row-clean" data-testid="point-row">
      <div className="point-meta-clean">
        <span>{row.displayDate}</span>
        {row.status && <span className="point-status-clean">{row.status.toUpperCase()}</span>}
        <span className="point-channel-clean">{row.channel}</span>
      </div>
      <div className="point-value-clean">
        <span>{row.label} #{row.orderId}</span>
        <strong className={row.status ? "is-pending" : row.points > 0 ? "is-positive" : "is-negative"}>
          {row.points > 0 ? "+" : ""}{row.points}
        </strong>
      </div>
    </article>
  )
}
