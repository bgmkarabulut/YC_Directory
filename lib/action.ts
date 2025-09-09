"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export async function createPitch(prevState: any, formData: FormData) {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const link = formData.get("link") as string;
  const pitch = formData.get("pitch") as string;

  const slug = slugify(title, { lower: true, strict: true });

  try {
    const startup = {
      _type: "startup",
      title,
      description,
      category,
      image: link,
      slug: { _type: "slug", current: slug },
      author: {
        _type: "reference",
        _ref: session.user.id,
      },
      pitch,
    };

    const result = await writeClient.create(startup);

    return {
      ...result, // içinde _id var
      error: "",
      status: "SUCCESS",
    };
  } catch (error) {
    console.error(error);
    return {
      error: JSON.stringify(error),
      status: "ERROR",
    };
  }
}
