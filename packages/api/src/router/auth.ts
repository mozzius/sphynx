import { z } from "zod";
import verifyAppleToken from "verify-apple-id-token";
import jwt from "jsonwebtoken";

import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  session: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
  user: publicProcedure.query(async ({ ctx }) => {
    // give unauthed queries null rather than using protectedProcedure
    // because we use it to check if the user is logged in
    // easier if this state logic is managed here rather than checking if
    // we have a token, because then you'd have to subscribe to the token manager etc
    if (!ctx.session) {
      return null;
    }
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.session.id },
    });
  }),
  apple: publicProcedure
    .input(z.object({ idToken: z.string(), name: z.string().optional() }))
    .mutation(async ({ ctx, input: { idToken, name } }) => {
      const res = await verifyAppleToken({
        clientId: process.env.APPLE_CLIENT_ID as string,
        idToken: idToken,
      });
      const appleId = res.sub;
      const email = res.email;
      const { id } = await ctx.prisma.user.upsert({
        where: { appleId },
        create: {
          appleId,
          email,
          name,
        },
        update: {
          name,
        },
      });

      const token = jwt.sign({ id, email }, process.env.JWT_SECRET as string);

      return {
        token,
      };
    }),
});
