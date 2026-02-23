import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export interface Context {
    supabase: Awaited<ReturnType<typeof createClient>>;
    user: User | null;
}

export async function createContext(): Promise<Context> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return {
        supabase,
        user,
    };
}
