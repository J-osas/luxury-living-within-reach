import { useNavigate } from "react-router-dom"
import { Faxi } from "@/components/faxi"
import { GameButton } from "@/components/game-button"
import { Overline } from "@/components/shell"

const points = [
  { title: "Quick quizzes", body: "Ten questions. Three misses. A fact you can keep." },
  { title: "Levels and XP", body: "Climb a path, or follow history and science on their own." },
  { title: "Play with friends", body: "Rooms and head-to-head duels are on the way." },
]

export function GetStarted() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-svh flex-col px-5 pt-8 pb-8">
      <div className="flex items-end gap-3">
        <Faxi pose="welcome" alt="Faxi waving" className="h-28 w-28" />
        <div>
          <Overline>Meet Faxi</Overline>
          <h1 className="font-display mt-1 text-[28px] leading-tight font-extrabold">
            Learn something new, every day.
          </h1>
        </div>
      </div>
      <ul className="mt-6 flex flex-col gap-3">
        {points.map((point) => (
          <li key={point.title} className="rounded-2xl border border-border bg-card p-4">
            <p className="font-display text-lg font-extrabold">{point.title}</p>
            <p className="mt-1 text-[15px] leading-snug text-muted-foreground">
              {point.body}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-3 pt-8">
        <GameButton onClick={() => navigate("/auth?mode=signup")}>Get started</GameButton>
        <GameButton variant="ghost" onClick={() => navigate("/auth?mode=login")}>
          I already have an account
        </GameButton>
      </div>
    </main>
  )
}
