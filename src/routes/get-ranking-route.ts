import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getRanking } from '../usecases/get-ranking'
import { getSubscriberInviteClicks } from '../usecases/get-subscriber-invite-clicks'

export const getRankingRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/ranking',
    {
      schema: {
        summary: 'Get ranking',
        tags: ['referrer'],
        response: {
          200: z.object({
            ranking: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                score: z.number(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { rankingWithScore } = await getRanking()

      return { ranking: rankingWithScore }
    }
  )
}
