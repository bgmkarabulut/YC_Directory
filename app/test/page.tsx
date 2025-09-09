"use client";

import { useActionState } from "react";
import { echoAction } from "./actions/Echo";

export default function TestPage() {
  const [state, formAction] = useActionState(echoAction, null);

  return (
    <form action={formAction}>
      <button type="submit">Submit</button>
    </form>
  );
}
