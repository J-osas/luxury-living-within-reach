"use client";

import { useEffect, useState } from "react";

const storageKey = "llwr-feedback-sketch";

const reactions = [
  "It feels clear",
  "I'm curious",
  "I'm sceptical",
  "This isn't for me",
] as const;

type Reaction = (typeof reactions)[number];

type Feedback = {
  reaction: Reaction;
  comprehension: string;
  concern: string;
  savedAt: string;
};

const steps = ["Reaction", "What this is", "A concern"] as const;

export function FeedbackForm() {
  const [step, setStep] = useState(0);
  const [reaction, setReaction] = useState<Reaction | "">("");
  const [comprehension, setComprehension] = useState("");
  const [concern, setConcern] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<Feedback | null>(null);
  const [storedOnDevice, setStoredOnDevice] = useState(false);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(storageKey);
      if (!existing) return;
      const parsed = JSON.parse(existing) as Feedback;
      if (parsed.reaction && parsed.comprehension && parsed.concern) {
        setSaved(parsed);
        setStoredOnDevice(true);
      }
    } catch {
      setSaved(null);
    }
  }, []);

  function next() {
    if (step === 0 && !reaction) {
      setError("Choose a reaction to continue.");
      return;
    }
    if (step === 1 && comprehension.trim().length < 8) {
      setError("Write a short sentence about what you think this is.");
      return;
    }
    setError("");
    setStep((current) => current + 1);
  }

  function save() {
    if (concern.trim().length < 8) {
      setError("Write a short note about what concerns you.");
      return;
    }
    if (!reaction) return;
    const entry: Feedback = {
      reaction,
      comprehension: comprehension.trim(),
      concern: concern.trim(),
      savedAt: new Date().toISOString(),
    };
    setSaved(entry);
    setError("");
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(entry));
      setStoredOnDevice(true);
    } catch {
      setStoredOnDevice(false);
    }
  }

  function startAgain() {
    setSaved(null);
    setStep(0);
    setReaction("");
    setComprehension("");
    setConcern("");
    setError("");
    setStoredOnDevice(false);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* The response was only on screen. */
    }
  }

  if (saved) {
    return (
      <div className="saved-note">
        <p className="section-label">Saved in this browser</p>
        <h2>Thank you. This stays here.</h2>
        <p>
          {storedOnDevice
            ? "Your response is stored on this device only. This sketch does not send it anywhere."
            : "This browser did not keep a copy. What you wrote is on this screen only, and it has not been sent."}
        </p>
        <p>This is not an enquiry, and it is not a request to buy a home.</p>
        <dl className="ledger">
          <div>
            <dt>Reaction</dt>
            <dd>{saved.reaction}</dd>
          </div>
          <div>
            <dt>What you think this is</dt>
            <dd>{saved.comprehension}</dd>
          </div>
          <div>
            <dt>Concern</dt>
            <dd>{saved.concern}</dd>
          </div>
        </dl>
        <div className="form-actions">
          <button type="button" className="secondary" onClick={startAgain}>
            Start again
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (step < 2) next();
        else save();
      }}
    >
      <ol className="steps" aria-label="Feedback steps">
        {steps.map((label, index) => (
          <li key={label} className={index === step ? "is-current" : undefined}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <fieldset className="choice-list">
          <legend>What is your reaction to the concept?</legend>
          {reactions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="reaction"
                value={option}
                checked={reaction === option}
                onChange={() => {
                  setReaction(option);
                  setError("");
                }}
              />
              {option}
            </label>
          ))}
        </fieldset>
      ) : null}

      {step === 1 ? (
        <div>
          <label htmlFor="comprehension">
            In a sentence, what do you think this is?
          </label>
          <textarea
            id="comprehension"
            name="comprehension"
            value={comprehension}
            onChange={(event) => setComprehension(event.target.value)}
          />
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <label htmlFor="concern">What concerns you, if you had to name one thing?</label>
          <textarea
            id="concern"
            name="concern"
            value={concern}
            onChange={(event) => setConcern(event.target.value)}
          />
        </div>
      ) : null}

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="form-actions">
        {step > 0 ? (
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setError("");
              setStep((current) => current - 1);
            }}
          >
            Back
          </button>
        ) : null}
        <button type="submit">{step < 2 ? "Next step" : "Save on this device"}</button>
      </div>
    </form>
  );
}
