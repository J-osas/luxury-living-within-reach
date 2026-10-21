import { useState, type FormEvent, type ReactNode } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Faxi } from "@/components/faxi"
import { GameButton } from "@/components/game-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePlayer } from "@/store/player"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const authTabClass =
  "h-full! rounded-xl border-transparent! font-display font-extrabold shadow-none! ring-0! outline-none! transition-none! data-active:bg-lime! data-active:text-ink! dark:data-active:border-transparent! dark:data-active:bg-lime! dark:data-active:text-ink! focus-visible:border-transparent! focus-visible:ring-0! focus-visible:outline-none!"

export function AuthScreen() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const mode = params.get("mode") === "login" ? "login" : "signup"
  const beginSignup = usePlayer((state) => state.beginSignup)
  const logIn = usePlayer((state) => state.logIn)
  const signInSocial = usePlayer((state) => state.signInSocial)

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState<"google" | "apple" | null>(null)

  function switchMode(next: "signup" | "login") {
    setError(null)
    setNotice(null)
    setParams({ mode: next })
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    setNotice(null)
    if (!emailPattern.test(email.trim())) {
      setError("That email doesn't look right. Check for typos.")
      return
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.")
      return
    }
    if (mode === "signup") {
      const name = username.trim()
      if (name.length < 3) {
        setError("Choose a username of at least 3 characters.")
        return
      }
      const problem = beginSignup({ email, username: name, password })
      if (problem) {
        setError(problem)
        return
      }
      navigate("/verify")
      return
    }
    const problem = logIn(email, password)
    if (problem) {
      setError(problem)
      return
    }
    navigate("/home", { replace: true })
  }

  function social(provider: "google" | "apple") {
    setBusy(provider)
    setError(null)
    window.setTimeout(() => {
      signInSocial(provider)
      navigate("/home", { replace: true })
    }, 600)
  }

  return (
    <main className="flex min-h-svh flex-col px-5 pt-8 pb-8">
      <div className="flex items-center gap-3">
        <Faxi pose="happy" alt="" className="h-16 w-16" />
        <div>
          <p className="font-display text-2xl font-extrabold">
            {mode === "signup" ? "Join the adventure" : "Welcome back"}
          </p>
          <p className="text-sm text-muted-foreground">
            {mode === "signup"
              ? "Create a name people will see when you play."
              : "Pick up your path where you left it."}
          </p>
        </div>
      </div>

      <Tabs
        value={mode}
        onValueChange={(value) => switchMode(value as "signup" | "login")}
        className="mt-5"
      >
        <TabsList className="grid h-12! w-full grid-cols-2 items-stretch! rounded-2xl bg-card p-1">
          <TabsTrigger value="signup" className={authTabClass}>
            Sign up
          </TabsTrigger>
          <TabsTrigger value="login" className={authTabClass}>
            Log in
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 flex flex-col gap-3">
        <GameButton
          variant="ghost"
          className="border-transparent bg-ivory text-ink hover:bg-ivory"
          disabled={busy !== null}
          onClick={() => social("google")}
        >
          <GoogleMark />
          {busy === "google" ? "Connecting…" : "Continue with Google"}
        </GameButton>
        <GameButton
          variant="ghost"
          className="border-transparent bg-ivory text-ink hover:bg-ivory"
          disabled={busy !== null}
          onClick={() => social("apple")}
        >
          <AppleMark />
          {busy === "apple" ? "Connecting…" : "Continue with Apple"}
        </GameButton>
      </div>

      <p className="my-4 text-center text-xs font-bold tracking-[0.08em] text-muted-foreground uppercase">
        or use email
      </p>

      <form className="flex flex-col gap-3" onSubmit={submit} noValidate>
        {mode === "signup" ? (
          <Field
            id="username"
            label="Username"
            hint="This is the name other players would see."
          >
            <Input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="h-[52px] rounded-[14px] border-2 bg-card px-3 text-base"
            />
          </Field>
        ) : null}
        <Field id="email" label="Email">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="h-[52px] rounded-[14px] border-2 bg-card px-3 text-base"
            aria-invalid={error?.includes("email") || undefined}
          />
        </Field>
        <Field id="password" label="Password">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            className="h-[52px] rounded-[14px] border-2 bg-card px-3 text-base"
          />
        </Field>
        {mode === "login" ? (
          <button
            type="button"
            className="self-start text-sm font-semibold text-[var(--cyan-ink)]"
            onClick={() =>
              setNotice("Password reset isn't available in this preview yet.")
            }
          >
            Forgot password?
          </button>
        ) : null}
        {error ? (
          <p role="alert" className="text-sm font-semibold text-wrong">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p role="status" className="text-sm text-muted-foreground">
            {notice}
          </p>
        ) : null}
        <GameButton type="submit" className="mt-2">
          {mode === "signup" ? "Create account" : "Log in"}
        </GameButton>
      </form>
      <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
        This preview keeps your session on this device only. Google and Apple
        buttons are placeholders and do not contact those services.
      </p>
    </main>
  )
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        fill="#4285F4"
        d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.5Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.8-1 7.7-2.9l-3.7-2.9c-1 .7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.6v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.4 14.5A7.2 7.2 0 0 1 5 12c0-.9.1-1.7.4-2.5V6.4H1.6A12 12 0 0 0 0 12c0 1.9.5 3.8 1.6 5.6l3.8-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.8 1.1 15.2 0 12 0A12 12 0 0 0 1.6 6.4l3.8 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
      />
    </svg>
  )
}

function AppleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-.1 2.9-2.2c.7-1 1.2-2 1.5-3.1-3.9-1.5-3.8-5.4-3.8-5.4Zm-2.8-7.2c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.3Z" />
    </svg>
  )
}
