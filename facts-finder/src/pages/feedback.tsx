import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Faxi } from "@/components/faxi"
import { GameButton } from "@/components/game-button"

const MAX_SECONDS = 60

export function FeedbackScreen() {
  const navigate = useNavigate()
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const fileRef = useRef<File | null>(null)
  const urlRef = useRef<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      const recorder = recorderRef.current
      if (recorder && recorder.state !== "inactive") recorder.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [])

  function releaseMic() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  function clearTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  function finishRecording() {
    clearTimer()
    const recorder = recorderRef.current
    if (recorder && recorder.state !== "inactive") recorder.stop()
    setRecording(false)
  }

  function storeClip(blob: Blob, type: string) {
    const ext = type.includes("mp4") ? "m4a" : "webm"
    fileRef.current = new File([blob], `facts-finder-feedback.${ext}`, { type })
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    const url = URL.createObjectURL(blob)
    urlRef.current = url
    setAudioUrl(url)
  }

  async function startRecording() {
    setError(null)
    setStatus(null)
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("This browser cannot record a voice note. You can still type feedback.")
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) =>
        MediaRecorder.isTypeSupported(type)
      )
      const recorder = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        const type = recorder.mimeType || mime || "audio/webm"
        storeClip(new Blob(chunksRef.current, { type }), type)
        releaseMic()
      }
      recorderRef.current = recorder
      recorder.start()
      setRecording(true)
      setSeconds(0)
      const started = Date.now()
      timerRef.current = window.setInterval(() => {
        const elapsed = Math.min(MAX_SECONDS, Math.floor((Date.now() - started) / 1000))
        setSeconds(elapsed)
        if (elapsed >= MAX_SECONDS) finishRecording()
      }, 250)
    } catch {
      releaseMic()
      setError("The microphone stayed off. You can still type a note.")
    }
  }

  function playClip() {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    void audio.play()
  }

  function downloadClip(file: File) {
    const url = urlRef.current
    if (!url) return
    const link = document.createElement("a")
    link.href = url
    link.download = file.name
    link.click()
  }

  async function send() {
    if (recording) {
      finishRecording()
      setStatus("Recording stopped. Tap Send when the clip is ready.")
      return
    }
    const written = note.trim()
    const file = fileRef.current
    if (!written && !file) {
      setError("Write a note or record a voice message first.")
      setStatus(null)
      return
    }
    setError(null)
    const body = written || "Voice note only."
    const shareFiles = file ? canShareFile(file) : false
    if (navigator.share && (shareFiles || !file)) {
      try {
        if (shareFiles && file) {
          await navigator.share({
            title: "Facts-Finder feedback",
            text: body,
            files: [file],
          })
        } else {
          await navigator.share({ title: "Facts-Finder feedback", text: body })
        }
        setStatus(null)
        return
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return
      }
    }
    if (file) downloadClip(file)
    let copied = false
    try {
      await navigator.clipboard.writeText(body)
      copied = true
    } catch {
      /* Clipboard can be blocked; the note stays on screen. */
    }
    if (file && copied) {
      setStatus("The voice note downloaded, and the text is copied. Send both.")
    } else if (file) {
      setStatus("The voice note downloaded. Copy the text and send both.")
    } else if (copied) {
      setStatus("The note is copied. Paste it into WhatsApp, Messages, or mail.")
    } else {
      setStatus("Copy the text above and send it.")
    }
  }

  const clock = `0:${String(seconds).padStart(2, "0")}`

  return (
    <main className="flex min-h-svh flex-col px-5 pt-6 pb-8">
      <button
        type="button"
        className="self-start text-sm font-semibold text-[var(--cyan-ink)]"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <div className="mt-4 flex items-center gap-3">
        <Faxi pose="encouraging" alt="" className="h-16 w-16" />
        <div>
          <h1 className="font-display text-2xl font-extrabold">Send feedback</h1>
          <p className="text-sm text-muted-foreground">The game is still being built.</p>
        </div>
      </div>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        aria-label="Written feedback"
        placeholder="What should we change?"
        className="mt-6 min-h-32 w-full resize-y rounded-[14px] border-2 border-input bg-card px-3 py-3 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring"
      />

      <div className="mt-4 rounded-2xl border border-border bg-card p-4">
        <p className="text-sm font-semibold">Voice note</p>
        <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
          {recording ? `Recording ${clock} of 1:00` : audioUrl ? `Ready ${clock}` : "Up to 1 minute"}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <GameButton
            type="button"
            variant="ghost"
            className="h-11 text-sm"
            disabled={recording}
            onClick={() => void startRecording()}
          >
            Record
          </GameButton>
          <GameButton
            type="button"
            variant="ghost"
            className="h-11 text-sm"
            disabled={!recording}
            onClick={finishRecording}
          >
            Stop
          </GameButton>
          <GameButton
            type="button"
            variant="ghost"
            className="h-11 text-sm"
            disabled={!audioUrl || recording}
            onClick={playClip}
          >
            Play
          </GameButton>
        </div>
        {audioUrl ? <audio ref={audioRef} src={audioUrl} className="sr-only" /> : null}
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-wrong">
          {error}
        </p>
      ) : null}
      {status ? (
        <p role="status" className="mt-3 text-sm text-muted-foreground">
          {status}
        </p>
      ) : null}

      <div className="mt-auto pt-6">
        <GameButton type="button" onClick={() => void send()}>
          Send
        </GameButton>
        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
          Nothing is stored on a server. Send opens your phone’s share sheet so you can pass the note to the person building the game.
        </p>
      </div>
    </main>
  )
}

function canShareFile(file: File) {
  if (!navigator.canShare) return false
  try {
    return navigator.canShare({ files: [file] })
  } catch {
    return false
  }
}
