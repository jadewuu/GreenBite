import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"

import { rewardsApi } from "@/lib/api/rewards-api"
import type { PointActivity } from "@/lib/api/types"

type PointsPageProps = {
  onBack?: () => void
}

type ActivityGroup = {
  label: string
  activities: PointActivity[]
}

function groupActivities(activities: PointActivity[]): ActivityGroup[] {
  return activities.reduce<ActivityGroup[]>((groups, activity) => {
    const date = new Date(`${activity.date}T12:00:00`)
    const label = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date)
    const group = groups.find((item) => item.label === label)

    if (group) {
      group.activities.push(activity)
    } else {
      groups.push({ label, activities: [activity] })
    }

    return groups
  }, [])
}

function formatActivityDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00:00`))
}

export function PointsPage({ onBack = () => { window.location.hash = "/rewards" } }: PointsPageProps) {
  const [activities, setActivities] = useState<PointActivity[] | null>(null)

  useEffect(() => {
    void rewardsApi.getActivities().then(setActivities)
  }, [])

  if (!activities) {
    return <main aria-busy="true" className="detail-screen" />
  }

  const groups = groupActivities(activities)

  return (
    <main className="detail-screen points-detail-screen">
      <header className="detail-header">
        <button aria-label="Back" onClick={onBack} type="button"><ArrowLeft aria-hidden="true" size={24} /></button>
        <h1>Points</h1>
        <span aria-hidden="true" />
      </header>

      {groups.length === 0 ? (
        <p className="detail-empty">No point activity yet.</p>
      ) : groups.map((group) => (
        <section aria-label={group.label} className="points-month" key={group.label}>
          <h2>{group.label}</h2>
          {group.activities.map((activity) => (
            <article className="points-detail-row" key={activity.id}>
              <div className="points-detail-meta">
                <span>{formatActivityDate(activity.date)}</span>
                <span>{activity.merchant}</span>
              </div>
              <div className="points-detail-value">
                <span>{activity.kind === "earned" ? "Purchase" : "Payment"}</span>
                <strong className={activity.points > 0 ? "points-positive" : "points-negative"}>
                  {activity.points > 0 ? "+" : ""}{activity.points}
                </strong>
              </div>
            </article>
          ))}
        </section>
      ))}
    </main>
  )
}
