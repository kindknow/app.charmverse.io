import { InvalidInputError } from '@charmverse/core/errors';
import { prisma } from '@charmverse/core/prisma-client';
import { deterministicV4UUIDFromFid } from '@connect-shared/lib/farcaster/uuidFromFid';
import type { FarcasterFrameInteractionToValidate } from '@root/lib/farcaster/validateFrameInteraction';
import { validateFrameInteraction } from '@root/lib/farcaster/validateFrameInteraction';

import { JoinWaitlistFrame } from 'components/frame/JoinWaitlistFrame';
import { WaitlistCurrentScoreFrame } from 'components/frame/WaitlistCurrentScoreFrame';
import { WaitlistJoinedFrame } from 'components/frame/WaitlistJoinedFrame';
import { trackWaitlistMixpanelEvent } from 'lib/mixpanel/trackMixpanelEvent';
import { handleTierChanges, refreshPercentilesForEveryone } from 'lib/scoring/refreshPercentilesForEveryone';
import { joinWaitlist } from 'lib/waitlistSlots/joinWaitlist';

export async function GET(req: Request) {
  const referrerFid = new URL(req.url).pathname.split('/')[3];

  const frame = JoinWaitlistFrame({ referrerFid });

  trackWaitlistMixpanelEvent('frame_impression', {
    referrerUserId: deterministicV4UUIDFromFid(referrerFid),
    frame: 'join_waitlist_info'
  });

  return new Response(frame, {
    status: 200,
    headers: {
      'Content-Type': 'text/html'
    }
  });
}

export async function POST(req: Request) {
  const waitlistClicked = (await req.json()) as FarcasterFrameInteractionToValidate;

  const validatedMessage = await validateFrameInteraction(waitlistClicked.trustedData.messageBytes);

  if (!validatedMessage.valid) {
    throw new InvalidInputError('Invalid frame interaction. Could not validate message');
  }

  const interactorFid = parseInt(validatedMessage.action.interactor.fid.toString(), 10);

  const interactorUsername = validatedMessage.action.interactor.username;

  const referrerFid = new URL(req.url).pathname.split('/')[3];

  const joinWaitlistResult = await joinWaitlist({
    fid: interactorFid,
    referredByFid: referrerFid,
    username: validatedMessage.action.interactor.username
  });

  const percentileChangeResults = await refreshPercentilesForEveryone();

  handleTierChanges(percentileChangeResults);

  let html: string = '';

  if (joinWaitlistResult.isNew) {
    trackWaitlistMixpanelEvent('frame_impression', {
      userId: deterministicV4UUIDFromFid(interactorFid),
      referrerUserId: deterministicV4UUIDFromFid(referrerFid),
      frame: 'join_waitlist_new_join'
    });
    html = await WaitlistJoinedFrame({ fid: interactorFid, username: interactorUsername });
  } else {
    const { percentile } = await prisma.connectWaitlistSlot.findFirstOrThrow({
      where: {
        fid: interactorFid
      },
      select: {
        percentile: true
      }
    });

    trackWaitlistMixpanelEvent('frame_impression', {
      userId: deterministicV4UUIDFromFid(interactorFid),
      referrerUserId: deterministicV4UUIDFromFid(referrerFid),
      frame: 'join_waitlist_current_score'
    });

    html = await WaitlistCurrentScoreFrame({
      fid: interactorFid,
      percentile: percentile as number,
      username: interactorUsername
    });
  }

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html'
    }
  });
}