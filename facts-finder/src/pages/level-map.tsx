import { useEffect, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Check } from "lucide-react"
import { Faxi } from "@/components/faxi"
import { Overline } from "@/components/shell"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LEVEL_COUNT, PATHS, type PathId } from "@/data/questions"
import { useHydrated } from "@/hooks/use-hydrated"
import { currentLevel, usePlayer, useSession } from "@/store/player"
import { cn } from "cn"

export function LevelMap() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const requested = params.get("path")
  const path: PathId =
    requested === "history" || requested === "science" ? requested : "general"
  const { profile, email } = useSession()
  const hydrated = useHydrated()
  const startRound = usePlayer((state) => state.startRound)
  const reduce = useReducedMotion()
  const current = currentLevel(profile.paths[path])
  const currentRef = useRef<HTMLButtonElement | null>(null)
  const notice = params.get("locked")

  useEffect(() => {
    if (hydrated && !email) navigate("/start", { replace: true })
  }, [email, hydrated, navigate])

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center" })
  }, [path, current])

  if (!hydrated || !email) return <main className="min-h-svh" />

  function openLevel(level: number) {
    const progress = profile.paths[path]
    const unlocked = progress.completed.includes(level) || level === current
    if (!unlocked) {
      setParams({ path, locked: String(current) })
      return
    }
    startRound(path, level)
    navigate("/round")
  }

  const info = PATHS.find((item) => item.id === path)

  return (
    <main className="flex flex-col px-5 pt-6">
      <Tabs
        value={path}
        onValueChange={(value) => setParams({ path: value })}
      >
        <TabsList className="grid h-11 w-full grid-cols-3 rounded-2xl bg-card p-1">
          {PATHS.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="rounded-xl text-xs font-bold data-active:bg-cyan data-active:text-ink"
            >
              {item.id === "general" ? "General" : item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <h1 className="font-display mt-4 text-[26px] font-extrabold">{info?.title}</h1>
      <p className="text-sm text-muted-foreground">
        Level {current} of {LEVEL_COUNT}
      </p>
      <div className="relative mx-auto mt-4 flex w-full max-w-xs flex-col gap-3">
        {Array.from({ length: LEVEL_COUNT }, (_, index) => LEVEL_COUNT - index).map(
          (level) => {
            const done = profile.paths[path].completed.includes(level)
            const isCurrent = level === current && !done
            const locked = !done && !isCurrent
            const bonus = level === 6
            return (
              <div
                key={level}
                className={cn(
                  "flex items-center",
                  level % 2 === 0 ? "justify-end" : "justify-start"
                )}
              >
                <motion.button
                  ref={isCurrent ? currentRef : undefined}
                  type="button"
                  onClick={() => openLevel(level)}
                  whileTap={locked && !reduce ? { x: [0, -6, 6, -4, 0] } : undefined}
                  className={cn(
                    "relative grid place-items-center rounded-full border-2 font-display font-extrabold",
                    isCurrent
                      ? "size-[84px] border-cyan bg-cyan text-2xl text-ink ring-4 ring-background ring-offset-2 ring-offset-cyan"
                      : "size-14 text-lg",
                    done && "border-lime bg-lime text-ink",
                    locked && "border-border bg-card text-muted-foreground",
                    bonus && locked && "border-dashed border-foreground"
                  )}
                  aria-label={
                    locked
                      ? `Level ${level} locked`
                      : done
                        ? `Replay level ${level}`
                        : `Play level ${level}`
                  }
                >
                  {done ? <Check aria-hidden="true" /> : level}
                  {isCurrent ? (
                    <Faxi
                      pose="guiding"
                      alt=""
                      className="absolute -top-8 -right-10 h-14 w-14"
                    />
                  ) : null}
                </motion.button>
              </div>
            )
          }
        )}
      </div>
      {notice ? (
        <p role="status" className="mt-3 text-center text-sm font-semibold">
          Finish level {notice} to unlock this one.
        </p>
      ) : null}
      <div className="mt-4 rounded-2xl border border-border bg-card p-4">
        <Overline>
          Level {current}
          {current === 6 ? " · Bonus" : ""}
        </Overline>
        <p className="font-display mt-1 text-lg font-extrabold">
          10 questions · 3 lives
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{info?.blurb}</p>
      </div>
    </main>
  )
}
