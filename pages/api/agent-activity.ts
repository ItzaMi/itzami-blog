import type { NextApiRequest, NextApiResponse } from 'next'

import { AgentActivitySnapshot } from '../../lib/agentActivity'
import { getCodexActivitySnapshot } from '../../lib/codexActivity.server'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<AgentActivitySnapshot | { error: string }>,
) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  response.setHeader('Cache-Control', 'no-store, max-age=0')
  return response.status(200).json(await getCodexActivitySnapshot())
}
