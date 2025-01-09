import LinkHeader from "http-link-header";
import { z } from "zod";

/** Apollo JSON error response. */
export interface ApolloError {
  error: string;
  detail?: Record<string, { error: string; description: string }[]>;
}

/** Parsed Apollo `Link` header. */
export interface ApolloLink {
  rel: string;
  uri: string;
}

export class ApolloResponse extends Response {
  /** Construct a `ApolloResponse` from a regular `Response` object. */
  static fromResponse(response: Response): ApolloResponse {
    // Fix for non-compliant browsers.
    // https://developer.mozilla.org/en-US/docs/Web/API/Response/body
    if (response.status === 204) {
      return new ApolloResponse(null, response);
    }

    return new ApolloResponse(response.body, response);
  }

  /** Parses the `Link` header and returns an array of URLs and their rel values. */
  links(): ApolloLink[] {
    const header = this.headers.get("link");

    if (header) {
      return new LinkHeader(header).refs;
    } else {
      return [];
    }
  }

  /** Parses the `Link` header and returns URLs for the `prev` and `next` pages of this response, if any. */
  pagination(): { prev: string | null; next: string | null } {
    const links = this.links();

    return {
      next: links.find((link) => link.rel === "next")?.uri ?? null,
      prev: links.find((link) => link.rel === "prev")?.uri ?? null,
    };
  }

  /** Returns the `next` URI from the `Link` header, if applicable. */
  next(): string | null {
    const links = this.links();
    return links.find((link) => link.rel === "next")?.uri ?? null;
  }

  /** Returns the `prev` URI from the `Link` header, if applicable. */
  prev(): string | null {
    const links = this.links();
    return links.find((link) => link.rel === "prev")?.uri ?? null;
  }

  /** Extracts the error JSON from the response body, if possible. Otherwise returns `null`. */
  async error(): Promise<ApolloError | null> {
    const data = await this.json();
    const result = ApolloResponse.errorSchema().safeParse(data);

    if (result.success) {
      return result.data;
    } else {
      return null;
    }
  }

  /** Validates the error response schema. */
  private static errorSchema(): z.ZodType<ApolloError> {
    return z.object({
      error: z.string(),
      detail: z
        .record(
          z.string(),
          z.object({ error: z.string(), description: z.string() }).array()
        )
        .optional(),
    });
  }
}
