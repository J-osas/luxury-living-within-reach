import { useState } from "react"
import { GameButton } from "@/components/game-button"
import { Overline } from "@/components/shell"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const friends = ["Amara", "Tunde", "Chioma"]

export function Compete() {
  const [notice, setNotice] = useState<string | null>(null)
  const [code, setCode] = useState("")

  function soon(message: string) {
    setNotice(message)
  }

  return (
    <main className="flex flex-col gap-4 px-5 pt-6">
      <div>
        <Overline>Together</Overline>
        <h1 className="font-display text-[28px] font-extrabold">Compete</h1>
      </div>
      <Card className="gap-3 rounded-2xl border-2 border-cyan bg-card p-4 ring-0">
        <p className="font-display text-xl font-extrabold">Live 1v1 duel</p>
        <p className="text-sm text-muted-foreground">
          Same questions, same timer, one winner. Live rooms are not connected yet.
        </p>
        <GameButton onClick={() => soon("Find opponent is coming soon.")}>
          Find opponent
        </GameButton>
      </Card>
      <Card className="gap-3 rounded-2xl border border-border bg-card p-4 ring-0">
        <p className="font-display text-xl font-extrabold">Host or join a room</p>
        <GameButton variant="ghost" onClick={() => soon("Room codes are coming soon.")}>
          Create room
        </GameButton>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="room-code">Room code</Label>
          <Input
            id="room-code"
            value={code}
            maxLength={6}
            autoCapitalize="characters"
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="4–6 letters"
            className="h-[52px] rounded-[14px] border-2 bg-card px-3 text-base tracking-[0.2em] uppercase"
          />
        </div>
        <GameButton
          onClick={() =>
            soon(
              code.length < 4
                ? "Enter a code of at least 4 characters."
                : "That room isn't live in this preview."
            )
          }
        >
          Join
        </GameButton>
      </Card>
      <section>
        <Overline>Friends</Overline>
        <ul className="mt-2 flex flex-col gap-2">
          {friends.map((friend) => (
            <li
              key={friend}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-3 py-2"
            >
              <span className="font-semibold">{friend}</span>
              <button
                type="button"
                className="min-h-11 rounded-full border border-border px-4 text-sm font-bold"
                onClick={() => soon(`Challenges for ${friend} are coming soon.`)}
              >
                Challenge
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Sample names, not real players.
        </p>
      </section>
      {notice ? (
        <p role="status" className="rounded-2xl bg-card px-4 py-3 text-sm font-semibold">
          {notice}
        </p>
      ) : null}
    </main>
  )
}
