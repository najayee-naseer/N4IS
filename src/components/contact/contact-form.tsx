"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { sendContactMessage, type ContactState } from "@/app/(site)/contact/actions";

type Fields = "name" | "email" | "subject" | "message";
type Errors = Partial<Record<Fields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Instant feedback in the browser; the server action validates again and is the one that counts. */
function validate(data: Record<Fields, string>): Errors {
  const errors: Errors = {};
  if (data.name.trim().length < 2) errors.name = "Please enter your name";
  if (!EMAIL.test(data.email.trim())) errors.email = "Please enter a valid email address";
  if (data.subject.trim().length < 3) errors.subject = "Please add a short subject";
  if (data.message.trim().length < 20) errors.message = "Please add a little more detail (20 characters or more)";
  return errors;
}

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, { status: "idle" });
  const [local, setLocal] = useState<Errors>({});
  const [dismissed, setDismissed] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const errors: Errors = { ...(state.status === "invalid" ? state.errors : {}), ...local };

  useEffect(() => {
    if (state.status === "sent") form.current?.reset();
    setDismissed(false);
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const found = validate({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    });
    setLocal(found);
    if (Object.keys(found).length > 0) {
      event.preventDefault();
      const first = event.currentTarget.querySelector<HTMLElement>('[data-invalid="true"] input, [data-invalid="true"] textarea');
      first?.focus();
    }
  }

  if (state.status === "sent" && !dismissed) {
    return (
      <div className="form-success" role="status">
        <p className="label label--accent">Message sent</p>
        <h2 className="h3">Thank you.</h2>
        <p className="muted">Your message has reached the studio. You&apos;ll hear back from the person who reads it.</p>
        <button type="button" className="btn btn--line" onClick={() => setDismissed(true)}>
          <span>Write another message</span>
          <span className="btn__arrow" aria-hidden="true">↗</span>
        </button>
      </div>
    );
  }

  return (
    <form className="form" action={action} onSubmit={onSubmit} ref={form} noValidate>
      {/* hidden from people; bots fill it and are quietly dropped */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />

      <div className="form__row">
        <label className="field" data-invalid={errors.name ? "true" : undefined}>
          <span>Name</span>
          <input name="name" autoComplete="name" placeholder="Your name" aria-invalid={Boolean(errors.name)} />
          {errors.name ? <span className="field__error">{errors.name}</span> : null}
        </label>

        <label className="field" data-invalid={errors.email ? "true" : undefined}>
          <span>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <span className="field__error">{errors.email}</span> : null}
        </label>
      </div>

      <label className="field" data-invalid={errors.subject ? "true" : undefined}>
        <span>Subject</span>
        <input name="subject" placeholder="What is this about?" aria-invalid={Boolean(errors.subject)} />
        {errors.subject ? <span className="field__error">{errors.subject}</span> : null}
      </label>

      <label className="field" data-invalid={errors.message ? "true" : undefined}>
        <span>Message</span>
        <textarea
          name="message"
          rows={6}
          placeholder="The idea, the problem, or the question."
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? <span className="field__error">{errors.message}</span> : null}
      </label>

      {state.status === "error" ? (
        <p className="field__error" role="alert">
          {state.message}
        </p>
      ) : null}

      <button type="submit" className="btn btn--primary" data-cursor="link" disabled={pending}>
        <span>{pending ? "Sending…" : "Send message"}</span>
        <span className="btn__arrow" aria-hidden="true">↗</span>
      </button>

      <p className="form__note">Messages go straight to the studio&apos;s inbox and are read by a person.</p>
    </form>
  );
}
