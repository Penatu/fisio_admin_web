import { cn } from "@/lib/utils"

function buildPoints(values, width, height, padX, padY) {
  const max = Math.max(...values, 1)
  const step = values.length > 1 ? (width - padX * 2) / (values.length - 1) : 0

  return values.map((value, index) => {
    const x = padX + index * step
    const y = padY + (1 - value / max) * (height - padY * 2)
    return { x, y, value }
  })
}

function toPath(points) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
}

function toAreaPath(points, height, padY) {
  if (!points.length) return ""
  const baseline = height - padY
  return `${toPath(points)} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`
}

export function AreaChart({
  labels = [],
  current = [],
  previous = [],
  unit = "",
  className,
  currentLabel = "Current period",
  previousLabel = "Previous period",
}) {
  const width = 800
  const height = 280
  const padX = 36
  const padY = 28

  const currentPoints = buildPoints(current, width, height, padX, padY)
  const previousPoints = previous.length
    ? buildPoints(previous, width, height, padX, padY)
    : []

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          {currentLabel}
        </span>
        {previous.length ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-primary/40 bg-primary/10" />
            {previousLabel}
          </span>
        ) : null}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="min-w-[640px] h-[260px] w-full"
          role="img"
          aria-label="Report chart"
        >
          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padX}
              x2={width - padX}
              y1={padY + (1 - ratio) * (height - padY * 2)}
              y2={padY + (1 - ratio) * (height - padY * 2)}
              stroke="currentColor"
              className="text-border"
              strokeDasharray="4 4"
            />
          ))}

          {previousPoints.length ? (
            <>
              <path
                d={toAreaPath(previousPoints, height, padY)}
                fill="currentColor"
                className="text-primary/10"
              />
              <path
                d={toPath(previousPoints)}
                fill="none"
                stroke="currentColor"
                className="text-primary/40"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
            </>
          ) : null}

          <path
            d={toAreaPath(currentPoints, height, padY)}
            fill="url(#areaGradient)"
            className="text-primary"
          />
          <path
            d={toPath(currentPoints)}
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="2.5"
          />

          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {currentPoints.map((point, index) => (
            <g key={labels[index] || index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                className="fill-background stroke-primary"
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                className="fill-foreground text-[11px] font-medium"
              >
                {point.value}
                {unit ? ` ${unit}` : ""}
              </text>
              <text
                x={point.x}
                y={height - 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[11px]"
              >
                {labels[index]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
