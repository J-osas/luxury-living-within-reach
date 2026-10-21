import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Faxi } from "@/components/faxi"
import { GameButton } from "@/components/game-button"
import { usePlayer } from "@/store/player"

export function VerifyScreen() {
  const navigate = useNavigate()
  const pending = usePlayer((state) => state.pending)
  const completePending = usePlayer((state) => state.completePending)
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [seconds, setSeconds] = useState(30)
  const [error, setError] = useState<string | null>(null)
  const inputs = useRef<Array<HTMLInputElement | null>>([])
  const submitted = useRef(false)
  const pendingOnArrival = useRef(pending)

  useEffect(() => {
    if (!pendingOnArrival.current) {
      navigate("/auth?mode=signup", { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    if (seconds <= 0) return
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [seconds])

  const code = digits.join("")

  useEffect(() => {
    if (code.length < 6 || submitted.current) return
    submitted.current = true
    const timer = window.setTimeout(() => {
      completePending()
      navigate("/home", { replace: true })
    }, 280)
    return () => window.clearTimeout(timer)
  }, [code, completePending, navigate])

  function write(index: number, value: string) {
    const clean = value.replace(/\D/g, "")
    if (!clean) {
      setDigits((current) => {
        const next = [...current]
        next[index] = ""
        return next
      })
      return
    }
    const chars = clean.slice(0, 6 - index).split("")
    setDigits((current) => {
      const next = [...current]
      chars.forEach((char, offset) => {
        next[index + offset] = char
      })
      return next
    })
    const focusAt = Math.min(index + chars.length, 5)
    inputs.current[focusAt]?.focus()
    setError(null)
  }

  if (!pending) return null

  return (
    <main className="flex min-h-svh flex-col px-5 pt-10 pb-8">
      <Faxi pose="explaining" alt="Faxi explaining the next step" className="h-28 w-28" />
      <h1 className="font-display mt-4 text-[28px] leading-tight font-extrabold">
        Check your email
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        Enter the 6-digit code for <span className="text-foreground">{pending.email}</span>.
        In this preview any 6 digits are accepted. A real code is not sent.
      </p>
      <div className="mt-6 flex justify-between gap-2" onPaste={(event) => {
        const text = event.clipboardData.getData("text")
        if (!/\d/.test(text)) return
        event.preventDefault()
        write(0, text)
      }}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              inputs.current[index] = node
            }}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${index + 1}`}
            value={digit}
            maxLength={1}
            className="h-14 w-full rounded-2xl border-2 border-border bg-card text-center text-2xl font-extrabold"
            onChange={(event) => write(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !digits[index] && index > 0) {
                inputs.current[index - 1]?.focus()
              }
            }}
          />
        ))}
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-wrong">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        className="mt-4 self-start text-sm font-semibold text-[var(--cyan-ink)] disabled:opacity-50"
        disabled={seconds > 0}
        onClick={() => {
          setSeconds(30)
          setDigits(["", "", "", "", "", ""])
          submitted.current = false
          setError(null)
          inputs.current[0]?.focus()
        }}
      >
        {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
      </button>
      <GameButton
        variant="ghost"
        className="mt-auto"
        onClick={() => {
          setError(null)
          navigate("/auth?mode=signup")
        }}
      >
        Use a different email
      </GameButton>
    </main>
  )
}
