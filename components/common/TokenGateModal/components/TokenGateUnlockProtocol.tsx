import { unlockChains } from 'connectors/chains';
import { useFormContext } from 'react-hook-form';

import { TextInputField } from 'components/common/form/fields/TextInputField';

import type { FormValues } from '../hooks/useCollectablesForm';

import { TokenGateBlockchainSelect } from './TokenGateBlockchainSelect';

export function TokenGateUnlockProtocol() {
  const {
    register,
    formState: { errors }
  } = useFormContext<FormValues>();

  return (
    <>
      <TokenGateBlockchainSelect
        error={!!errors.chain?.message}
        helperMessage={errors.chain?.message}
        chains={unlockChains}
        {...register('chain')}
      />
      <TextInputField
        label='Lock Contract Address'
        error={errors.contract?.message}
        helperText={errors.contract?.message}
        {...register('contract')}
      />
    </>
  );
}