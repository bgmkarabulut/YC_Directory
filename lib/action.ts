"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string
) => {
  console.log("createPitch Server Action initiated.");

  try {
    const session = await auth();
    console.log(
      "Session object:",
      session ? "Authenticated" : "Not authenticated"
    );

    if (!session) {
      console.log("Error: User session not found.");
      return parseServerActionResponse({
        error: "Not signed in",
        status: "ERROR",
      });
    }

    const { title, description, category, link } = Object.fromEntries(
      Array.from(form).filter(([key]) => key !== "pitch")
    );

    const slug = slugify(title as string, { lower: true, strict: true });

    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session.user.id,
      },
      pitch,
    };

    console.log(
      "Attempting to write to Sanity with payload:",
      JSON.stringify(startup, null, 2)
    );

    const result = await writeClient.create({ _type: "startup", ...startup });

    console.log(
      "Sanity write successful. Result:",
      JSON.stringify(result, null, 2)
    );

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error: any) {
    console.error("An unexpected error occurred in createPitch:", error);

    // Attempt to stringify a meaningful error message
    let errorMessage = "An unexpected error has occurred";
    if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return parseServerActionResponse({
      error: errorMessage,
      status: "ERROR",
    });
  }
};
