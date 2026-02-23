import { router } from "../trpc";
import { coursesRouter } from "./courses";

export const appRouter = router({
    courses: coursesRouter,
});

export type AppRouter = typeof appRouter;
