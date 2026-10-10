/* eslint-disable @typescript-eslint/no-explicit-any */

declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

declare module "jsr:@supabase/functions-js/edge-runtime.d.ts";
