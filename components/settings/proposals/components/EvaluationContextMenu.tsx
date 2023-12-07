import type { WorkflowEvaluationJson } from '@charmverse/core/proposals';
import { MoreHoriz } from '@mui/icons-material';
import { Box, IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import { usePopupState, bindMenu, bindTrigger } from 'material-ui-popup-state/hooks';

export type ContextMenuProps = {
  evaluation: WorkflowEvaluationJson;
  onDelete: (id: string) => void;
  onDuplicate: (evaluation: WorkflowEvaluationJson) => void;
  onRename: (evaluation: WorkflowEvaluationJson) => void;
  readOnly: boolean;
};

export function EvaluationContextMenu({ evaluation, onDelete, onDuplicate, onRename, readOnly }: ContextMenuProps) {
  const popupState = usePopupState({ variant: 'popover', popupId: `menu-${evaluation.id}` });

  function duplicateEvaluation() {
    onDuplicate({ ...evaluation, title: `${evaluation.title} (copy)` });
  }

  function deleteEvaluation() {
    onDelete(evaluation.id);
  }

  function renameEvaluation() {
    onRename(evaluation);
  }
  return (
    <>
      <Menu {...bindMenu(popupState)} onClick={popupState.close}>
        <MenuItem disabled={readOnly} onClick={renameEvaluation}>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem disabled={readOnly} onClick={duplicateEvaluation}>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem disabled={readOnly} onClick={deleteEvaluation}>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <Box display='flex' gap={2} alignItems='center'>
        <IconButton size='small' {...bindTrigger(popupState)}>
          <MoreHoriz fontSize='small' />
        </IconButton>
      </Box>
    </>
  );
}
