"use client";

import { useActionState } from "react";

async function echoAction(prev: any, formData: FormData) {
  "use server";
  console.log("🔥 Server action çalıştı!");
  return { ok: true };
}

export default function TestPage() {
  const [state, action, pending] = useActionState(echoAction, { ok: false });

  return (
    <form action={action}>
      <button type="submit">{pending ? "..." : "Deneme"}</button>
    </form>
  );
}
