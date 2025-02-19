import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { env } from '../env'
import { redis } from '../redis/client'
import { accesInviteLink } from '../usecases/access-invite-link'

export const accesInviteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/invites/:subscriberId',
    {
      schema: {
        summary: 'Access invite link',
        tags: ['referrer'],
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          302: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { subscriberId } = request.params
      await accesInviteLink({ subscriberId })
      console.log(await redis.hgetall('referral:access-count'))
      const redirectUrl = new URL(env.WEB_URL)

      redirectUrl.searchParams.set('referrer', subscriberId)

      return reply.redirect(redirectUrl.toString(), 302)
    }
  )
}
