import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  DAILY_COUNT,
  LEVEL_COUNT,
  MISTAKE_LIMIT,
  QUESTIONS_PER_LEVEL,
  XP_BAND,
  pickQuestions,
  todayKey,
  yesterdayKey,
  type PathId,
  type Question,
} from "@/data/questions"

export type Account = {
  email: string
  username: string
  password: string
}

export type PathProgress = {
  completed: number[]
  attempts: number
}

export type MissedFact = {
  text: string
  correct: string
  explanation: string
}

export type RoundResult = {
  path: PathId
  level: number
  mode: "level" | "daily"
  correct: number
  total: number
  mistakes: number
  points: number
  xpEarned: number
  passed: boolean
  bestStreak: number
  missed: MissedFact[]
  leveledUp: boolean
}

export type Profile = {
  xp: number
  streak: number
  lastPlayedDate: string | null
  dailyClearedOn: string | null
  paths: Record<PathId, PathProgress>
  badge: string
}

export type RoundAnswer = {
  questionId: string
  chosenIndex: number | null
  correct: boolean
  points: number
}

export type RoundState = {
  path: PathId
  level: number
  mode: "level" | "daily"
  questions: Question[]
  index: number
  mistakes: number
  points: number
  correct: number
  streak: number
  bestStreak: number
  answers: RoundAnswer[]
  phase: "question" | "feedback"
  chosenIndex: number | null
  timedOut: boolean
  questionStartedAt: number
}

type PendingSignup = {
  email: string
  username: string
  password: string
}

type PlayerState = {
  accounts: Account[]
  sessionEmail: string | null
  pending: PendingSignup | null
  profiles: Record<string, Profile>
  lastResult: RoundResult | null
  round: RoundState | null
  signUp: (account: Account) => string | null
  beginSignup: (account: Account) => string | null
  logIn: (email: string, password: string) => string | null
  completePending: () => void
  signInSocial: (provider: "google" | "apple") => void
  signOut: () => void
  clearPending: () => void
  startRound: (path: PathId, level: number, mode?: "level" | "daily") => void
  answerQuestion: (chosenIndex: number | null, secondsLeft: number) => void
  continueRound: () => "next" | "results"
  clearRound: () => void
}

function emptyPath(): PathProgress {
  return { completed: [], attempts: 0 }
}

export function emptyProfile(): Profile {
  return {
    xp: 0,
    streak: 0,
    lastPlayedDate: null,
    dailyClearedOn: null,
    paths: {
      general: emptyPath(),
      history: emptyPath(),
      science: emptyPath(),
    },
    badge: "Curious mind",
  }
}

export function currentLevel(progress: PathProgress) {
  for (let level = 1; level <= LEVEL_COUNT; level += 1) {
    if (!progress.completed.includes(level)) {
      return level
    }
  }
  return LEVEL_COUNT
}

export function playerLevel(xp: number) {
  return Math.floor(xp / XP_BAND) + 1
}

function badgeFor(xp: number, clears: number) {
  if (xp >= XP_BAND) return "Scholar"
  if (clears > 0) return "Pathfinder"
  return "Curious mind"
}

function emailKey(email: string) {
  return email.trim().toLowerCase()
}

export const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => ({
      accounts: [],
      sessionEmail: null,
      pending: null,
      profiles: {},
      lastResult: null,
      round: null,
      beginSignup: (account) => {
        const email = emailKey(account.email)
        if (get().accounts.some((item) => item.email === email)) {
          return "That email is already in use. Try logging in."
        }
        set({
          pending: {
            email,
            username: account.username.trim(),
            password: account.password,
          },
        })
        return null
      },
      signUp: (account) => get().beginSignup(account),
      completePending: () => {
        const pending = get().pending
        if (!pending) return
        const exists = get().accounts.some((item) => item.email === pending.email)
        set((state) => ({
          accounts: exists
            ? state.accounts
            : [
                ...state.accounts,
                {
                  email: pending.email,
                  username: pending.username,
                  password: pending.password,
                },
              ],
          profiles: exists
            ? state.profiles
            : { ...state.profiles, [pending.email]: emptyProfile() },
          sessionEmail: pending.email,
          pending: null,
        }))
      },
      logIn: (email, password) => {
        const key = emailKey(email)
        const account = get().accounts.find((item) => item.email === key)
        if (!account || account.password !== password) {
          return "Those details don't match. Check your email and password."
        }
        set((state) => ({
          sessionEmail: key,
          pending: null,
          profiles: state.profiles[key]
            ? state.profiles
            : { ...state.profiles, [key]: emptyProfile() },
        }))
        return null
      },
      signInSocial: (provider) => {
        const email = `${provider}.player@local.facts`
        const username = provider === "google" ? "Google player" : "Apple player"
        set((state) => {
          const accounts = state.accounts.some((item) => item.email === email)
            ? state.accounts
            : [...state.accounts, { email, username, password: "" }]
          const profiles = state.profiles[email]
            ? state.profiles
            : { ...state.profiles, [email]: emptyProfile() }
          return {
            accounts,
            profiles,
            sessionEmail: email,
            pending: null,
          }
        })
      },
      signOut: () => set({ sessionEmail: null, round: null }),
      clearPending: () => set({ pending: null }),
      startRound: (path, level, mode = "level") => {
        const email = get().sessionEmail
        if (!email) return
        const profile = get().profiles[email] ?? emptyProfile()
        const attempts =
          mode === "daily"
            ? profile.paths[path].attempts
            : profile.paths[path].attempts + 1
        const count = mode === "daily" ? DAILY_COUNT : QUESTIONS_PER_LEVEL
        const seed =
          mode === "daily"
            ? `${email}|daily|${todayKey()}`
            : `${email}|${path}|${level}|${attempts}`
        const nextProfile: Profile = {
          ...profile,
          paths: {
            ...profile.paths,
            [path]: { ...profile.paths[path], attempts },
          },
        }
        set({
          profiles: { ...get().profiles, [email]: nextProfile },
          round: {
            path,
            level,
            mode,
            questions: pickQuestions(path, seed, count),
            index: 0,
            mistakes: 0,
            points: 0,
            correct: 0,
            streak: 0,
            bestStreak: 0,
            answers: [],
            phase: "question",
            chosenIndex: null,
            timedOut: false,
            questionStartedAt: Date.now(),
          },
        })
      },
      answerQuestion: (chosenIndex, secondsLeft) => {
        const round = get().round
        if (!round || round.phase !== "question") return
        const question = round.questions[round.index]
        const correct = chosenIndex === question.correctIndex
        const gained = correct ? 100 + Math.max(0, Math.round(secondsLeft) * 2) : 0
        const streak = correct ? round.streak + 1 : 0
        set({
          round: {
            ...round,
            phase: "feedback",
            chosenIndex,
            timedOut: chosenIndex === null,
            points: round.points + gained,
            correct: round.correct + (correct ? 1 : 0),
            mistakes: round.mistakes + (correct ? 0 : 1),
            streak,
            bestStreak: Math.max(round.bestStreak, streak),
            answers: [
              ...round.answers,
              {
                questionId: question.id,
                chosenIndex,
                correct,
                points: gained,
              },
            ],
          },
        })
      },
      continueRound: () => {
        const round = get().round
        const email = get().sessionEmail
        if (!round || !email) return "results"
        const failed = round.mistakes >= MISTAKE_LIMIT
        const finished = round.index >= round.questions.length - 1
        if (!failed && !finished) {
          set({
            round: {
              ...round,
              index: round.index + 1,
              phase: "question",
              chosenIndex: null,
              timedOut: false,
              questionStartedAt: Date.now(),
            },
          })
          return "next"
        }

        const profile = get().profiles[email] ?? emptyProfile()
        const passed = !failed && finished
        const alreadyDone =
          round.mode === "level" &&
          profile.paths[round.path].completed.includes(round.level)
        let xpEarned = passed
          ? 80 + round.correct * 12 + Math.round(round.points / 10)
          : round.correct * 8
        if (passed && alreadyDone) xpEarned = Math.round(xpEarned / 2)
        const dailyBonus =
          round.mode === "daily" &&
          passed &&
          profile.dailyClearedOn !== todayKey()
        if (dailyBonus) xpEarned += 120

        const playedToday = profile.lastPlayedDate === todayKey()
        const streak = playedToday
          ? profile.streak
          : profile.lastPlayedDate === yesterdayKey()
            ? profile.streak + 1
            : 1
        const beforeLevel = playerLevel(profile.xp)
        const xp = profile.xp + xpEarned
        const completed =
          passed && round.mode === "level"
            ? Array.from(new Set([...profile.paths[round.path].completed, round.level]))
            : profile.paths[round.path].completed
        const clears = Object.values({
          ...profile.paths,
          [round.path]: { ...profile.paths[round.path], completed },
        }).reduce((sum, path) => sum + path.completed.length, 0)
        const nextProfile: Profile = {
          ...profile,
          xp,
          streak,
          lastPlayedDate: todayKey(),
          dailyClearedOn: dailyBonus ? todayKey() : profile.dailyClearedOn,
          badge: badgeFor(xp, clears),
          paths: {
            ...profile.paths,
            [round.path]: { ...profile.paths[round.path], completed },
          },
        }
        const missed = round.answers
          .filter((answer) => !answer.correct)
          .map((answer) => {
            const question = round.questions.find((item) => item.id === answer.questionId)
            return {
              text: question?.text ?? "",
              correct: question ? question.options[question.correctIndex] : "",
              explanation: question?.explanation ?? "",
            }
          })
        const result: RoundResult = {
          path: round.path,
          level: round.level,
          mode: round.mode,
          correct: round.correct,
          total: round.questions.length,
          mistakes: round.mistakes,
          points: round.points,
          xpEarned,
          passed,
          bestStreak: round.bestStreak,
          missed,
          leveledUp: playerLevel(xp) > beforeLevel,
        }
        set({
          profiles: { ...get().profiles, [email]: nextProfile },
          lastResult: result,
          round: null,
        })
        return "results"
      },
      clearRound: () => set({ round: null }),
    }),
    {
      name: "facts-finder-player",
      partialize: (state) => ({
        accounts: state.accounts,
        sessionEmail: state.sessionEmail,
        pending: state.pending,
        profiles: state.profiles,
        lastResult: state.lastResult,
      }),
    }
  )
)

export function useSession() {
  const email = usePlayer((state) => state.sessionEmail)
  const account = usePlayer((state) =>
    state.accounts.find((item) => item.email === email)
  )
  const profile = usePlayer((state) =>
    email ? (state.profiles[email] ?? emptyProfile()) : emptyProfile()
  )
  return { email, account, profile }
}
