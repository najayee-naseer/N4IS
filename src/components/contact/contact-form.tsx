"use client";

import { useState, type FormEvent } from "react";

type Fields = "name" | "email" | "subject" | "message";
type Errors = Partial<Record<Fields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data: Record<Fields, string>): Errors {
  const errors: Errors = {};
  if (data.name.trim().length < 2) errors.name = "Please enter your name";
  if (!EMAIL.test(data.email.trim())) errors.email = "Please enter a valid email address";
  if (data.subject.trim().length < 3) errors.subject = "Please add a short subject";
  if (data.message.trim().length < 20) errors.message = "Please add a little more detail (20 characters or more)";
  return errors;
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [prepared, setPrepared] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const found = validate(data);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const first = form.querySelector<HTMLElement>('[data-invalid="true"] input, [data-invalid="true"] textarea');
      first?.focus();
      return;
    }

    setPrepared(true);
    form.reset();
  }

  if (prepared) {
    return (
      <div className="form-success" role="status">
        <p className="label label--accent">Message prepared</p>
        <h2 className="h3">Thank you.</h2>
        <p className="muted">
          This form is validated and ready for a backend or email integration. Nothing has been sent from the
          website yet — the delivery step is still being connected.
        </p>
        <button type="button" className="btn btn--line" onClick={() => setPrepared(false)}>
          <span>Write another message</span>
          <span className="btn__arrow" aria-hidden="true">↗</span>
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
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

      <button type="submit" className="btn btn--primary" data-cursor="link">
        <span>Send message</span>
        <span className="btn__arrow" aria-hidden="true">↗</span>
      </button>

      <p className="form__note">
        This form is prepared for a future email or backend integration. Submitting it validates and formats
        your message but does not send it yet.
      </p>
    </form>
  );
}
