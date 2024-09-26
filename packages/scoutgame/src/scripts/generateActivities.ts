import { log } from '@charmverse/core/log';
import { PointsDirection, prisma } from '@charmverse/core/prisma-client';

import { builderContractAddress, builderNftChain } from '../builderNfts/constants';
import type { ActivityToRecord } from '../recordGameActivity';
import { recordGameActivity } from '../recordGameActivity';
import { refreshUserStats } from '../refreshUserStats';
import { createMockEvents, ensureGithubUserExists } from '../testing/database';
import { getCurrentWeek } from '../dates';

function getRandomDateWithinLast30Days() {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - 30);
  return new Date(pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime()));
}

export async function generateActivities({ userId }: { userId: string }) {
  const mints = await prisma.nFTPurchaseEvent.findMany({
    where: {
      scoutId: userId
    }
  });

  const builderStrikeEvents = await prisma.builderStrike.findMany({
    where: {
      builderId: userId
    }
  });

  const pointRecepts = await prisma.pointsReceipt.findMany({
    where: {
      OR: [
        {
          senderId: userId
        },
        {
          recipientId: userId
        }
      ]
    }
  });

  const gemPayouts = await prisma.gemsPayoutEvent.findMany({
    where: {
      builderId: userId
    }
  });

  const builderTokenEvents = await prisma.builderNft.findFirst({
    where: {
      chainId: builderNftChain.id,
      contractAddress: builderContractAddress,
      builderId: userId
    },
    include: {
      nftSoldEvents: {
        select: {
          scoutId: true
        }
      }
    }
  });

  const events: ActivityToRecord[] = [
    ...mints.map((event) => ({
      activity: {
        userId: event.scoutId,
        amount: event.tokensPurchased,
        pointsDirection: PointsDirection.in,
        createdAt: getRandomDateWithinLast30Days()
      },
      sourceEvent: {
        nftPurchaseEventId: event.id
      }
    })),
    ...builderStrikeEvents.map((event) => ({
      activity: {
        userId: event.builderId,
        amount: 0,
        pointsDirection: PointsDirection.in,
        createdAt: getRandomDateWithinLast30Days()
      },
      sourceEvent: {
        builderStrikeId: event.id
      }
    })),
    ...pointRecepts.flatMap((event) => {
      const _events: ActivityToRecord[] = [];

      if (event.senderId) {
        _events.push({
          activity: {
            userId: event.senderId,
            amount: event.value,
            pointsDirection: PointsDirection.out,
            createdAt: getRandomDateWithinLast30Days()
          },
          sourceEvent: {
            pointsReceiptId: event.id
          }
        });
      }

      if (event.recipientId) {
        _events.push({
          activity: {
            userId: event.recipientId,
            amount: event.value,
            pointsDirection: PointsDirection.in,
            createdAt: getRandomDateWithinLast30Days()
          },
          sourceEvent: {
            pointsReceiptId: event.id
          }
        });
      }

      return _events;
    }),
    ...gemPayouts.flatMap((event) => {
      const _events: ActivityToRecord[] = [];
      if (event.points) {
        _events.push({
          activity: {
            userId: event.builderId,
            amount: event.points,
            pointsDirection: PointsDirection.in,
            createdAt: getRandomDateWithinLast30Days()
          },
          sourceEvent: {
            gemsPayoutEventId: event.id
          }
        });
      }

      if (event.points) {
        _events.push({
          activity: {
            userId: event.builderId,
            amount: event.points,
            pointsDirection: PointsDirection.in,
            createdAt: getRandomDateWithinLast30Days()
          },
          sourceEvent: {
            gemsPayoutEventId: event.id
          }
        });
      }

      return _events;
    }),
    ...(builderTokenEvents?.nftSoldEvents.map((event) => ({
      activity: {
        userId: event.scoutId,
        amount: 0,
        pointsDirection: PointsDirection.in,
        createdAt: getRandomDateWithinLast30Days()
      },
      sourceEvent: {
        builderStrikeId: event.scoutId
      }
    })) || [])
  ];

  // Ensure no NFTs are sold until the BuilderToken is issued
  const builderTokenIssuedAt = builderTokenEvents ? getRandomDateWithinLast30Days() : null;
  if (builderTokenIssuedAt) {
    builderTokenEvents!.createdAt = builderTokenIssuedAt;
    events.push({
      activity: {
        userId: builderTokenEvents!.builderId,
        amount: 0,
        pointsDirection: PointsDirection.in,
        createdAt: builderTokenIssuedAt
      },
      sourceEvent: {
        builderStrikeId: builderTokenEvents!.id
      }
    });
  }

  // Sort events by createdAt
  events.sort((a, b) => a.activity.createdAt!.getTime() - b.activity.createdAt!.getTime());

  // Record activities
  for (const event of events) {
    await recordGameActivity(event).catch((error) => log.error(`Error recording activity`, { error }));
  }

  const stats = await prisma.userWeeklyStats.upsert({
    where: {
      userId_week: {
        userId,
        week: getCurrentWeek()
      }
    },
    create: {
      userId,
      week: getCurrentWeek(),
      gemsCollected: 30
    },
    update: {
      gemsCollected: 30
    }
  });
}

const githubLogin = 'motechFR';

async function script() {
  const githubAccount = await ensureGithubUserExists({
    login: githubLogin
  });

  let user = await prisma.scout.findFirst({
    where: {
      githubUser: {
        some: {
          login: githubLogin
        }
      }
    }
  });

  if (!user) {
    user = await prisma.scout.create({
      data: {
        displayName: githubAccount.login as string,
        username: githubAccount.login as string,
        builder: true,
        githubUser: {
          connect: {
            id: githubAccount.id
          }
        }
      }
    });
  }

  const userId = user.id;

  const current = await prisma.scoutGameActivity.count({
    where: {
      userId
    }
  });

  await createMockEvents({ userId, amount: 7 });

  await generateActivities({ userId });

  const newCount = await prisma.scoutGameActivity.count({
    where: {
      userId
    }
  });

  await refreshUserStats({ userId });

  log.info(`Created ${newCount - current}`);
}

script();