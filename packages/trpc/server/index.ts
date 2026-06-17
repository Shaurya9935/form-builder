import { publicProcedure, router } from "./trpc";
import {z} from 'zod'
import { healthRouter } from "./routes/health/route";


export const serverRouter = router({
  health: healthRouter,
  chaicode: publicProcedure
  .meta({ openapi: {method:'GET', path: '/chaicode '}})
  .input(z.object({name:z.string(), email: z.email(), age: z.number() }))
  .output(z.object({ message: z.string() }))
  .query(async ({input}) => {
    return {
      message: `Hello Mr.${input.name} ${input.email} ${input.age}`
    }
  })
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
