import type { User } from '@charmverse/core/prisma';
import type { Proposal, ProposalCategory, Space } from '@charmverse/core/prisma-client';
import { prisma } from '@charmverse/core/prisma-client';
import { testUtilsProposals, testUtilsUser } from '@charmverse/core/test';
import { test as base, expect } from '@playwright/test';
import { DatabasePage } from '__e2e__/po/databasePage.po';
import { DocumentPage } from '__e2e__/po/document.po';
import { PagesSidebarPage } from '__e2e__/po/pagesSiderbar.po';

import { loginBrowserUser } from '../utils/mocks';

type Fixtures = {
  pagesSidebar: PagesSidebarPage;
  document: DocumentPage;
  databasePage: DatabasePage;
};

const test = base.extend<Fixtures>({
  pagesSidebar: ({ page }, use) => use(new PagesSidebarPage(page)),
  document: ({ page }, use) => use(new DocumentPage(page)),
  databasePage: ({ page }, use) => use(new DatabasePage(page))
});

// Will be set by the first test
let spaceUser: User;
let space: Space;
let databasePagePath: string;
let databasePageId: string;

let proposalCategory: ProposalCategory;
let firstProposal: Proposal;
let secondProposal: Proposal;
let thirdProposal: Proposal;
let draftProposal: Proposal;

test.beforeAll(async () => {
  const generated = await testUtilsUser.generateUserAndSpace({
    isAdmin: true
  });

  spaceUser = generated.user;
  space = generated.space;

  proposalCategory = await testUtilsProposals.generateProposalCategory({
    spaceId: space.id
  });

  firstProposal = await testUtilsProposals.generateProposal({
    spaceId: space.id,
    userId: spaceUser.id,
    categoryId: proposalCategory.id,
    proposalStatus: 'discussion'
  });

  secondProposal = await testUtilsProposals.generateProposal({
    spaceId: space.id,
    userId: spaceUser.id,
    categoryId: proposalCategory.id,
    proposalStatus: 'discussion'
  });

  thirdProposal = await testUtilsProposals.generateProposal({
    spaceId: space.id,
    userId: spaceUser.id,
    categoryId: proposalCategory.id,
    proposalStatus: 'discussion'
  });

  draftProposal = await testUtilsProposals.generateProposal({
    spaceId: space.id,
    userId: spaceUser.id,
    categoryId: proposalCategory.id,
    proposalStatus: 'draft'
  });
});

test.describe.serial('Database with proposals as datasource', async () => {
  test('create a board', async ({ page, pagesSidebar, databasePage }) => {
    // Arrange ------------------
    await loginBrowserUser({
      browserPage: page,
      userId: spaceUser.id
    });

    await pagesSidebar.goToHomePage(space.domain);

    // Add the database page from the sidebar
    await expect(pagesSidebar.pagesSidebar).toBeVisible();

    await pagesSidebar.pagesSidebar.hover();

    await pagesSidebar.pagesSidebarAddPageButton.click();

    await expect(pagesSidebar.pagesSidebarSelectAddDatabaseButton).toBeVisible();

    await pagesSidebar.pagesSidebarSelectAddDatabaseButton.click();

    await expect(pagesSidebar.databasePage).toBeVisible();

    // Initialise the new database
    await expect(databasePage.selectProposalsAsSource).toBeVisible();

    // This is important as we want to simulate multiple clicks to ensure the card creation only happens once
    await Promise.all([
      databasePage.selectProposalsAsSource.click(),
      databasePage.selectProposalsAsSource.click(),
      databasePage.selectProposalsAsSource.click()
    ]);

    await databasePage.page.waitForResponse(/api\/pages\/.{1,}\/proposal-source/);

    await databasePage.page.waitForTimeout(500);

    // Wait until the database is initialised

    const syncedCards = await prisma.page.findMany({
      where: {
        syncWithPageId: {
          not: null
        },
        spaceId: space.id
      },
      select: {
        id: true,
        syncWithPageId: true
      }
    });
    // Regression check to make sure we did not create duplicate cards
    expect(syncedCards.length).toBe(3);

    const allTargetProposalIds = [firstProposal.id, secondProposal.id, thirdProposal.id];

    // We should only create cards for none draft proposals
    expect(syncedCards.map((c) => c.syncWithPageId)).toEqual(expect.arrayContaining(allTargetProposalIds));

    for (const card of syncedCards) {
      const row = databasePage.getTableRowByCardId({ cardId: card.id });

      await expect(row).toBeVisible();

      const selectProps = await row.locator('data-test=select-preview').all();

      const categorySelect = selectProps[0];

      expect((await categorySelect.allInnerTexts())[0]).toEqual(proposalCategory.title);

      const statusSelect = selectProps[1];

      expect((await statusSelect.allInnerTexts())[0]).toEqual('Feedback');
    }

    // Make sure the UI only displays 3 cards
    await expect(databasePage.getTableRowByIndex({ index: 0 })).toBeVisible();
    await expect(databasePage.getTableRowByIndex({ index: 1 })).toBeVisible();
    await expect(databasePage.getTableRowByIndex({ index: 2 })).toBeVisible();
    await expect(databasePage.getTableRowByIndex({ index: 3 })).not.toBeVisible();
  });
});