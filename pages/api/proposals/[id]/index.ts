import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { prisma } from 'db';
import { ActionNotPermittedError, NotFoundError, onError, onNoMatch, requireUser } from 'lib/middleware';
import { computeUserPagePermissions } from 'lib/permissions/pages';
import { computeProposalPermissions } from 'lib/permissions/proposals/computeProposalPermissions';
import { getProposal } from 'lib/proposal/getProposal';
import type { ProposalWithUsers } from 'lib/proposal/interface';
import { updateProposal } from 'lib/proposal/updateProposal';
import { withSessionRoute } from 'lib/session/withSession';
import { AdministratorOnlyError } from 'lib/users/errors';
import { hasAccessToSpace } from 'lib/users/hasAccessToSpace';
import { UnauthorisedActionError } from 'lib/utilities/errors';

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch });

handler.put(updateProposalController).get(getProposalController);

async function getProposalController(req: NextApiRequest, res: NextApiResponse<ProposalWithUsers>) {
  const proposalId = req.query.id as string;
  const userId = req.session.user?.id;

  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposalId
    },
    include: {
      authors: true,
      reviewers: true,
      category: true
    }
  });

  if (!proposal) {
    throw new NotFoundError();
  }

  const computed = await computeUserPagePermissions({
    // Proposal id is the same as page
    resourceId: proposal?.id,
    userId
  });

  if (computed.read !== true) {
    throw new NotFoundError();
  }

  return res.status(200).json(proposal);
}

async function updateProposalController(req: NextApiRequest, res: NextApiResponse) {
  const proposalId = req.query.id as string;
  const userId = req.session.user.id;

  const { authors, reviewers, categoryId } = req.body;

  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposalId
    },
    include: {
      authors: true,
      reviewers: true,
      page: {
        select: {
          type: true
        }
      }
    }
  });

  if (!proposal) {
    throw new NotFoundError();
  }

  const { error, isAdmin } = await hasAccessToSpace({
    spaceId: proposal.spaceId,
    userId,
    adminOnly: false
  });

  if (error) {
    throw error;
  }

  // Only admins can update proposal templates
  if (proposal.page?.type === 'proposal_template' && !isAdmin) {
    throw new AdministratorOnlyError();
  }
  // A proposal can only be updated when its in private_draft, draft or discussion status and only the proposal author can update it
  const proposalPermissions = await computeProposalPermissions({
    resourceId: proposal.id,
    userId
  });

  if (!proposalPermissions.edit) {
    throw new ActionNotPermittedError(`You can't update this proposal.`);
  }

  await updateProposal({ proposalId: proposal.id, authors, reviewers, categoryId });

  const updatedProposal = await getProposal({ proposalId: proposal.id });

  return res.status(200).send(updatedProposal);
}

export default withSessionRoute(handler);
