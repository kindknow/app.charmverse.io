import { Box } from '@mui/material';
import type { ReactNode } from 'react';

import { StickyFooter } from 'components/common/Footer/StickyFooter';
import { HeaderMessage } from 'components/common/Header/components/HeaderMessage';
import { Header } from 'components/common/Header/Header';
import { getUserFromSession } from 'lib/session/getUserFromSession';

export default async function Layout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getUserFromSession();

  return (
    <Box display='grid' gridTemplateRows='auto 1fr auto' minHeight='100vh' bgcolor='background.default'>
      <Header user={user || null} />
      <Box component='main' pb={2} minHeight='100%'>
        <HeaderMessage />
        {children}
      </Box>
      <StickyFooter />
    </Box>
  );
}
