"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.email("Please enter a valid email."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  message: z.string().min(20, "Tell me a little more about your goals."),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async () => {
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="grid min-h-96 place-items-center rounded-3xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-900 dark:bg-green-500/10" role="status">
        <div><CheckCircle2 className="mx-auto size-12 text-green-600" /><h2 className="mt-5 text-2xl font-black text-gray-950 dark:text-white">Message ready.</h2><p className="mt-3 max-w-sm text-gray-600 dark:text-gray-300">This frontend demo validates your message locally. Connect your preferred form service before launch to deliver submissions.</p><Button className="mt-6" onClick={() => setSubmitted(false)}>Send another message</Button></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}><Input autoComplete="name" placeholder="Your name" {...register("name")} aria-invalid={Boolean(errors.name)} /></Field>
        <Field label="Email" error={errors.email?.message}><Input type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} aria-invalid={Boolean(errors.email)} /></Field>
      </div>
      <Field label="Phone" error={errors.phone?.message}><Input type="tel" autoComplete="tel" placeholder="Your phone number" {...register("phone")} aria-invalid={Boolean(errors.phone)} /></Field>
      <Field label="Message" error={errors.message?.message}><Textarea placeholder="Tell me about your goals, experience, and availability…" {...register("message")} aria-invalid={Boolean(errors.message)} /></Field>
      <Button type="submit" size="lg" disabled={isSubmitting}>Send message <Send className="size-4" /></Button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</span>{children}{error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}</label>;
}
