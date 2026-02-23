import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const coursesRouter = router({
    list: protectedProcedure
        .input(
            z.object({
                page: z.number().int().min(1).default(1),
                pageSize: z.number().int().min(1).max(50).default(6),
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize } = input;
            const offset = (page - 1) * pageSize;

            // Get total count
            const { count } = await ctx.supabase
                .from("courses")
                .select("*", { count: "exact", head: true })
                .eq("user_id", ctx.user.id);

            const total = count ?? 0;

            // Get paginated courses
            const { data: courses, error } = await ctx.supabase
                .from("courses")
                .select("*")
                .eq("user_id", ctx.user.id)
                .order("created_at", { ascending: false })
                .range(offset, offset + pageSize - 1);

            if (error) {
                throw new Error(error.message);
            }

            return {
                courses: courses ?? [],
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            };
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const { data: course, error } = await ctx.supabase
                .from("courses")
                .select("*")
                .eq("id", input.id)
                .eq("user_id", ctx.user.id)
                .single();

            if (error || !course) {
                throw new Error("Course not found");
            }

            return course;
        }),

    create: protectedProcedure
        .input(
            z.object({
                title: z.string().min(1, "Title is required").max(200),
                description: z.string().max(5000).default(""),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { data: course, error } = await ctx.supabase
                .from("courses")
                .insert({
                    title: input.title,
                    description: input.description,
                    user_id: ctx.user.id,
                })
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return course;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                title: z.string().min(1, "Title is required").max(200),
                description: z.string().max(5000).default(""),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { data: course, error } = await ctx.supabase
                .from("courses")
                .update({
                    title: input.title,
                    description: input.description,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", input.id)
                .eq("user_id", ctx.user.id)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return course;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { error } = await ctx.supabase
                .from("courses")
                .delete()
                .eq("id", input.id)
                .eq("user_id", ctx.user.id);

            if (error) {
                throw new Error(error.message);
            }

            return { success: true };
        }),
});
