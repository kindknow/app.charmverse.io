'use client';

import { BasicModal } from 'components/common/Modal';
import type { MinimalUserInfo } from 'lib/users/interfaces';

import { NFTPurchaseForm } from './NFTPurchaseForm';

export function NFTPurchaseDialog(props: {
  open: boolean;
  onClose: VoidFunction;
  builder: MinimalUserInfo & { price?: bigint; nftImageUrl?: string | null };
}) {
  return (
    <BasicModal open={props.open} onClose={props.onClose} title={`Scout @${props.builder.username}`} theme='dark'>
      <NFTPurchaseForm builder={props.builder} />
    </BasicModal>
  );
}