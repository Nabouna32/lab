declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

declare module "npm:@supabase/supabase-js@2" {
  export function createClient(...args: unknown[]): any;
}

declare module "jsr:@supabase/functions-js/edge-runtime.d.ts";
