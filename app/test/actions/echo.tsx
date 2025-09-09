"use server";

export async function echoAction(prev: any, formData: FormData) {
  console.log("🔥 Server action çalıştı!");
  return { ok: true };
}
