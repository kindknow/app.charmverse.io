import { prisma } from '@charmverse/core/prisma-client';
import { cache } from 'react';

import type { BasicUserInfo } from './interfaces';
import { BasicUserInfoSelect } from './queries';

export async function getUserByUsernamePath(
  username: string
): Promise<(BasicUserInfo & { nftImageUrl?: string; congratsImageUrl?: string | null }) | null> {
  const user = await prisma.scout.findFirst({
    where: {
      username
    },
    select: { ...BasicUserInfoSelect, builderNfts: true }
  });

  if (!user) {
    return null;
  }

  return {
    ...user,
    nftImageUrl: user?.builderNfts[0]?.imageUrl,
    congratsImageUrl: user?.builderNfts[0]?.congratsImageUrl,
    githubLogin: user?.githubUser[0]?.login
  };
}

export const getUserByPath = cache(getUserByUsernamePath);
