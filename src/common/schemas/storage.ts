import { z } from "zod"

export const federationSchema = z.object({
  name: z.string(),
  id: z.string(),
  icon: z.string().url(),
  network: z.enum(["signet", "bitcoin"]),
  invite: z.string(),
})
