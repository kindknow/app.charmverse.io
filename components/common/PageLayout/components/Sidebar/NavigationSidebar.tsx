import type { Page } from '@charmverse/core/prisma';
import styled from '@emotion/styled';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import type { BoxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { useCallback, useMemo, useState } from 'react';

import { SpaceSettingsDialog } from 'components/settings/SettingsDialog';
import { BlockCounts } from 'components/settings/subscription/BlockCounts';
import { charmverseDiscordInvite } from 'config/constants';
import { useCharmRouter } from 'hooks/useCharmRouter';
import { useCurrentSpace } from 'hooks/useCurrentSpace';
import { useCurrentSpacePermissions } from 'hooks/useCurrentSpacePermissions';
import { useFavoritePages } from 'hooks/useFavoritePages';
import { useFeaturesAndMembers } from 'hooks/useFeaturesAndMemberProfiles';
import { useForumCategories } from 'hooks/useForumCategories';
import { useHasMemberLevel } from 'hooks/useHasMemberLevel';
import { useIsCharmverseSpace } from 'hooks/useIsCharmverseSpace';
import useKeydownPress from 'hooks/useKeydownPress';
import { useSmallScreen } from 'hooks/useMediaScreens';
import type { SettingsPath } from 'hooks/useSettingsDialog';
import { useSettingsDialog } from 'hooks/useSettingsDialog';
import { useUser } from 'hooks/useUser';
import { useWeb3Account } from 'hooks/useWeb3Account';
import type { NewPageInput } from 'lib/pages';
import { addPageAndRedirect } from 'lib/pages';

import NewPageMenu from '../NewPageMenu';
import { PageIcon } from '../PageIcon';
import PageNavigation from '../PageNavigation';
import { SearchInWorkspaceModal } from '../SearchInWorkspaceModal';
import TrashModal from '../TrashModal';

import { NotificationUpdates } from './components/NotificationsPopover';
import { SectionName } from './components/SectionName';
import { sidebarItemStyles, SidebarLink } from './components/SidebarButton';
import SidebarSubmenu from './components/SidebarSubmenu';

const WorkspaceLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .add-a-page {
    display: flex;
    position: absolute;
    right: 8px;
    top: 0px;
  }
  padding: 4px 0;
`;

const SidebarContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.palette.sidebar.background};
  min-height: 100vh;
  ${({ theme }) => `
    ${theme.breakpoints.up('md')} {
      height: 100%;
    }
`}
  // disable hover UX on ios which converts first click to a hover event
  @media (pointer: fine) {
    .add-a-page {
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }
    .sidebar-header .MuiIconButton-root {
      opacity: 0;
    }
    &:hover {
      .sidebar-header {
        .MuiTypography-root {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .MuiIconButton-root {
          opacity: 1;
        }
        > .MuiButton-root {
          padding-right: ${({ theme }) => theme.spacing(5)};
        }
      }
      .add-a-page {
        opacity: 1;
      }
    }
  }
`;

const StyledSidebarBox = styled(Box)`
  cursor: pointer;
  ${sidebarItemStyles}
`;

const ScrollingContainer = styled.div<{ isScrolled: boolean }>`
  flex-grow: 1;
  overflow-y: auto;
  transition: border-color 0.2s ease-out;
  border-top: 1px solid transparent;
  ${({ isScrolled, theme }) => (isScrolled ? `border-top: 1px solid ${theme.palette.divider}` : '')};
`;

function SidebarBox({ icon, label, ...props }: { icon: any; label: string } & BoxProps) {
  return (
    <StyledSidebarBox {...props}>
      {icon}
      {label}
    </StyledSidebarBox>
  );
}

interface SidebarProps {
  closeSidebar: () => void;
  navAction?: () => void;
}

export function NavigationSidebar({ closeSidebar, navAction }: SidebarProps) {
  const { navigateToSpacePath, router } = useCharmRouter();
  const { user, logoutUser } = useUser();
  const { space } = useCurrentSpace();
  const { categories } = useForumCategories();
  const [userSpacePermissions] = useCurrentSpacePermissions();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showingTrash, setShowingTrash] = useState(false);
  const { logoutWallet } = useWeb3Account();
  const isMobile = useSmallScreen();
  const { hasAccess: showMemberFeatures, isLoadingAccess } = useHasMemberLevel('member');
  const { favoritePageIds } = useFavoritePages();

  const { openSettings } = useSettingsDialog();

  const handleModalClick = (path?: SettingsPath) => {
    openSettings(path);
    navAction?.();
  };
  const searchInWorkspaceModalState = usePopupState({ variant: 'popover', popupId: 'search-in-workspace-modal' });

  const openSearchLabel = useKeydownPress(searchInWorkspaceModalState.toggle, { key: 'p', ctrl: true });
  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    setIsScrolled(e.currentTarget?.scrollTop > 0);
  }

  const addPage = useCallback(
    (_page: Partial<Page>) => {
      if (user && space) {
        const newPage: NewPageInput = {
          ..._page,
          createdBy: user.id,
          spaceId: space.id
        };

        addPageAndRedirect(newPage, navigateToSpacePath);
      }
    },
    [user?.id, space?.id]
  );

  async function logoutCurrentUser() {
    logoutWallet();
    await logoutUser();
    router.push('/');
  }

  const pagesNavigation = useMemo(() => {
    return (
      <>
        {favoritePageIds.length > 0 && (
          <Box mb={2}>
            <SectionName mb={1}>FAVORITES</SectionName>
            <PageNavigation isFavorites rootPageIds={favoritePageIds} onClick={navAction} />
          </Box>
        )}
        <WorkspaceLabel data-test='page-sidebar-header'>
          <SectionName>SPACE</SectionName>
          {/** Test component */}
          {userSpacePermissions?.createPage && showMemberFeatures && (
            <div className='add-a-page'>
              <NewPageMenu data-test='sidebar-add-page' tooltip='Add a page' addPage={addPage} />
            </div>
          )}
        </WorkspaceLabel>
        <Box mb={6}>
          <PageNavigation onClick={navAction} />
        </Box>
        <Box mb={2}>
          <SidebarBox
            onClick={() => handleModalClick(isMobile ? undefined : 'space')}
            icon={<SettingsIcon color='secondary' fontSize='small' />}
            label='Settings'
            data-test='sidebar-settings'
          />
          <SidebarLink
            active={false}
            external
            href={charmverseDiscordInvite}
            icon={<QuestionMarkIcon color='secondary' fontSize='small' />}
            label='Support & Feedback'
            target='_blank'
            onClick={navAction}
          />
          <SidebarBox
            data-test='sidebar--trash-toggle'
            onClick={() => {
              setShowingTrash(true);
            }}
            icon={<DeleteOutlinedIcon fontSize='small' />}
            label='Trash'
          />
          <Box my={2} />

          {
            // Don't show block counts for free or entreprise spaces
            space?.paidTier === 'community' && (
              <Box ml={2}>
                <BlockCounts />
              </Box>
            )
          }
        </Box>
      </>
    );
  }, [favoritePageIds, userSpacePermissions, isMobile, navAction, addPage, showMemberFeatures]);

  const { features } = useFeaturesAndMembers();
  const isCharmverse = useIsCharmverseSpace();

  return (
    <SidebarContainer>
      <Box display='flex' flexDirection='column' sx={{ height: '100%', flexGrow: 1, width: 'calc(100% - 57px)' }}>
        <SidebarSubmenu
          closeSidebar={closeSidebar}
          logoutCurrentUser={logoutCurrentUser}
          openProfileModal={() => handleModalClick('profile')}
        />
        {space && (
          <>
            <Box mb={2}>
              <Tooltip
                title={
                  <>
                    Search and jump to a page <br />
                    {openSearchLabel}
                  </>
                }
                placement='right'
              >
                <div>
                  <SidebarBox
                    onClick={(e) => {
                      searchInWorkspaceModalState.open(e);
                      navAction?.();
                    }}
                    icon={<SearchIcon color='secondary' fontSize='small' />}
                    label='Quick Find'
                  />
                </div>
              </Tooltip>
              <SearchInWorkspaceModal
                isOpen={searchInWorkspaceModalState.isOpen}
                close={searchInWorkspaceModalState.close}
              />

              {!isLoadingAccess && (
                <>
                  {showMemberFeatures && (
                    <SidebarBox
                      onClick={() => handleModalClick('invites')}
                      icon={<GroupAddOutlinedIcon color='secondary' fontSize='small' />}
                      label='Invites'
                    />
                  )}
                  <NotificationUpdates closeSidebar={navAction} />
                  <Divider sx={{ mx: 2, my: 1 }} />
                  {features
                    .filter((feat) => !feat.isHidden)
                    .map((feat) => {
                      if (
                        showMemberFeatures ||
                        // Always show forum to space members. Show it to guests if they have access to at least 1 category
                        (feat.path === 'forum' && categories.length > 0)
                      ) {
                        return (
                          <SidebarLink
                            key={feat.path}
                            href={`/${space.domain}/${feat.path}`}
                            active={router.pathname.startsWith(`/[domain]/${feat.path}`)}
                            icon={<PageIcon icon={null} pageType={feat.path} />}
                            label={feat.title}
                            onClick={navAction}
                            data-test={`sidebar-link-${feat.path}`}
                          />
                        );
                      }

                      return null;
                    })}
                </>
              )}
            </Box>
            {isMobile ? (
              <div>{pagesNavigation}</div>
            ) : (
              <ScrollingContainer isScrolled={isScrolled} onScroll={onScroll} className='page-navigation'>
                {pagesNavigation}
              </ScrollingContainer>
            )}
          </>
        )}
      </Box>
      {showingTrash && (
        <TrashModal
          isOpen={showingTrash}
          onClose={() => {
            setShowingTrash(false);
          }}
        />
      )}
      <SpaceSettingsDialog />
    </SidebarContainer>
  );
}