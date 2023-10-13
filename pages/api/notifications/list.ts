import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { onError, onNoMatch, requireUser } from 'lib/middleware';
import { getCardNotifications } from 'lib/notifications/cards/getCardNotifications';
import { getDocumentNotifications } from 'lib/notifications/documents/getDocumentNotifications';
import { getPostNotifications } from 'lib/notifications/forum/getForumNotifications';
import type { Notification } from 'lib/notifications/interfaces';
import { getPollNotifications } from 'lib/notifications/polls/getPollNotifications';
import { getProposalNotifications } from 'lib/notifications/proposals/getProposalNotifications';
import { getBountyNotifications } from 'lib/notifications/rewards/getRewardNotifications';
import { sortByDate } from 'lib/notifications/utils';
import { withSessionRoute } from 'lib/session/withSession';

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch });

handler.use(requireUser).get(getNotifications);

async function getNotifications(req: NextApiRequest, res: NextApiResponse<Notification[]>) {
  const userId = req.session.user.id;
  const notifications: Notification[] = (
    await Promise.all([
      getDocumentNotifications(userId),
      getCardNotifications(userId),
      getPollNotifications(userId),
      getProposalNotifications(userId),
      getBountyNotifications(userId),
      getPostNotifications(userId)
    ])
  ).flat();

  return res.status(200).json(notifications.sort(sortByDate));
}

export default withSessionRoute(handler);