import type { Metadata } from "next";
import { Disclosure, SectionLabel } from "@/components/Frame";
import { FeedbackForm } from "@/app/feedback/FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "A three-step response to the fictional concept. Answers stay on this device.",
};

export default function FeedbackPage() {
  return (
    <div className="prose">
      <SectionLabel>Feedback</SectionLabel>
      <h1>Tell us what you understood</h1>
      <p className="lede">
        Three short steps: a reaction, what you think this is, and one concern.
        There is no contact field.
      </p>
      <Disclosure>
        Saving keeps the response in this browser. It is not sent to a server,
        and it is not an enquiry about buying a home.
      </Disclosure>
      <FeedbackForm />
    </div>
  );
}
