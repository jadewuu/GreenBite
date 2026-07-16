type DetailHeaderProps = {
  arrow: string
  onBack: () => void
  title: string
}

export function DetailHeader({ arrow, onBack, title }: DetailHeaderProps) {
  return (
    <header className="detail-header-clean">
      <button aria-label="Back" className="detail-back-clean" onClick={onBack} type="button">
        <img alt="" src={arrow} />
      </button>
      <h1>{title}</h1>
      <span aria-hidden="true" />
    </header>
  )
}
