declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

declare module "npm:@supabase/supabase-js@2" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  export function createClient(...args: unknown[]): any;
}

declare module "jsr:@supabase/functions-js/edge-runtime.d.ts";
