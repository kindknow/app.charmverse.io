import type { ProposalRubricCriteria, ProposalRubricCriteriaAnswer } from '@charmverse/core/prisma-client';
import styled from '@emotion/styled';
import { Box, FormGroup, FormLabel, TextField, Rating, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import type { FieldArrayWithId, UseFormRegister } from 'react-hook-form';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import { Button } from 'components/common/Button';
import { isTruthy } from 'lib/utilities/types';

import { IntegerInput, CriteriaRow } from './ProposalRubricCriteriaInput';

export type FormInput = { answers: ProposalRubricCriteriaAnswer[] };

type Props = {
  answers?: ProposalRubricCriteriaAnswer[];
  criteriaList: ProposalRubricCriteria[];
  onSubmit: (answers: FormInput) => void;
};

const StyledIcon = styled.div`
  align-items: center;
  border-radius: 50%;
  display: flex;
  width: 2em;
  height: 2em;
  justify-content: center;
  padding: 10px;
  background: #fff;
  border: 1px solid var(--input-border);
  text-align: center;
  font-size: 16px;
`;

const StyledRating = styled(Rating)`
  .icon {
    color: var(--primary-text);
  }
  .MuiRating-iconFilled .icon {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
  }
  .MuiRating-iconHover {
    transform: none;
  }
`;

export function RubricEvaluationForm({ criteriaList = [], answers = [], onSubmit }: Props) {
  const mappedAnswers = criteriaList.map(
    (criteria) => answers?.find((a) => a.rubricCriteriaId === criteria.id) || { rubricCriteriaId: criteria.id }
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<FormInput>({
    // mode: 'onChange',
    defaultValues: {
      answers: mappedAnswers
    }
    // resolver: yupResolver(schema(hasCustomReward))
  });
  const { fields } = useFieldArray({ control, name: 'answers' });

  useEffect(() => {
    // update the form values when the criteria list loads
    reset({ answers: mappedAnswers });
  }, [mappedAnswers.length]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        {fields.map((field, index) => (
          <CriteriaInput
            key={field.id}
            criteria={criteriaList[index]}
            field={field}
            index={index}
            control={control}
            register={register}
          />
        ))}
        <Button type='submit'>Submit</Button>
      </Box>
    </form>
  );
}

function CriteriaInput({
  criteria,
  field,
  index,
  control,
  register
}: {
  criteria: ProposalRubricCriteria;
  field: FieldArrayWithId<FormInput, 'answers', 'id'>;
  index: number;
  control: any;
  register: UseFormRegister<FormInput>;
}) {
  const parameters = criteria.parameters as { min: number; max: number };
  const rangeLength = parameters.max - parameters.min + 1; // add one since the max is included
  const IconContainerComponent = useMemo(
    () =>
      // eslint-disable-next-line react/no-unstable-nested-components
      function NumberIcon({ value, ...other }: { value: number }) {
        return (
          <Box {...other} mx={0.5}>
            <StyledIcon className='icon'>{convertMUIRatingToActual(value, parameters.min)}</StyledIcon>
          </Box>
        );
      },
    [parameters.min]
  );
  const muiMax = convertActualToMUIRating(parameters.max, parameters.min);
  const useRatingsInput = rangeLength < 8;
  return (
    <CriteriaRow key={field.id} mb={2}>
      <FormGroup sx={{ display: 'flex', gap: 1 }}>
        <Box display='flex' justifyContent='space-between'>
          <div>
            <Typography variant='subtitle1'>
              {criteria.title} ({parameters.min}&ndash; {parameters.max})
            </Typography>
            {criteria.description && <Typography variant='body2'>{criteria.description}</Typography>}
          </div>
          <Controller
            render={({ field: _field }) =>
              useRatingsInput ? (
                <StyledRating
                  value={
                    typeof _field.value === 'number' ? convertActualToMUIRating(_field.value, parameters.min) : null
                  }
                  IconContainerComponent={IconContainerComponent}
                  max={muiMax}
                  highlightSelectedOnly
                  onChange={(e, num) => {
                    _field.onChange(typeof num === 'number' ? convertMUIRatingToActual(num, parameters.min) : null);
                  }}
                />
              ) : (
                <FormGroup row sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                  <FormLabel>Your score:</FormLabel>
                  <IntegerInput
                    inputProps={{
                      'data-criteria': criteria.id,
                      placeholder: 'N/A'
                    }}
                    onChange={(score) => {
                      _field.onChange(score);
                    }}
                    maxWidth={50}
                    value={_field.value}
                  />
                </FormGroup>
              )
            }
            control={control}
            name={`answers.${index}.response.score`}
            defaultValue={(field.response as any)?.score}
          />
        </Box>
        <TextField multiline placeholder='Leave a comment' {...register(`answers.${index}.comment`)}></TextField>
      </FormGroup>
    </CriteriaRow>
  );
}

// Ratings component value always starts at 1, so subtract the difference between the min value and 1
function convertMUIRatingToActual(value: number, min: number) {
  const minOffset = 1 - min;
  return value - minOffset;
}

function convertActualToMUIRating(value: number, min: number) {
  const minOffset = 1 - min;
  return value + minOffset;
}