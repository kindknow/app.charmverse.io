import Box from '@mui/material/Box';
import BountyDetails from 'components/bounties/[bountyId]/BountyDetails';
import PageLayout from 'components/common/PageLayout';
import { setTitle } from 'hooks/usePageTitle';
import { ReactElement } from 'react';

export default function BountyPage () {

  setTitle('Bounties');

  return (
    <BountyDetails />
  );

}

BountyPage.getLayout = (page: ReactElement) => {
  return (
    <PageLayout>
      {page}
    </PageLayout>
  );
};
