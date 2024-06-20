import { Add } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { Dispatch, LegacyRef, ReactNode, SetStateAction } from 'react';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { useDrop } from 'react-dnd';

import { SelectionContext, useAreaSelection } from 'hooks/useAreaSelection';
import { useConfirmationModal } from 'hooks/useConfirmationModal';
import useEfficientDragLayer from 'hooks/useEffecientDragLayer';
import useKeydownPress from 'hooks/useKeydownPress';
import { useLocalDbViewSettings } from 'hooks/useLocalDbViewSettings';
import type { Board, BoardGroup, IPropertyOption, IPropertyTemplate } from 'lib/databases/board';
import type { BoardView } from 'lib/databases/boardView';
import { createBoardView } from 'lib/databases/boardView';
import type { Card } from 'lib/databases/card';
import { Constants } from 'lib/databases/constants';

import mutator from '../../mutator';
import { useAppDispatch } from '../../store/hooks';
import { updateView } from '../../store/views';
import { Utils } from '../../utils';

import CalculationRow from './calculation/calculationRow';
import { PaginatedRows } from './PaginatedRows';
import TableGroup from './tableGroup';
import { TableGroups } from './tableGroups';
import TableHeaders from './tableHeaders';
import TableRows from './tableRows';

type Props = {
  selectedCardIds: string[];
  board: Board;
  cards: Card[];
  activeView: BoardView;
  views: BoardView[];
  visibleGroups: BoardGroup[];
  groupByProperty?: IPropertyTemplate;
  readOnly: boolean;
  cardIdToFocusOnRender: string;
  showCard: (cardId: string | null) => void;
  addCard: (groupByOptionId?: string) => Promise<void> | void;
  onCardClicked: (e: React.MouseEvent, card: Card) => void;
  onDeleteCard?: (cardId: string) => Promise<void>;
  readOnlyTitle?: boolean;
  readOnlyRows?: boolean;
  disableAddingCards?: boolean;
  expandSubRowsOnLoad?: boolean;
  rowExpansionLocalStoragePrefix?: string;
  subRowsEmptyValueContent?: React.ReactElement | string;
  checkedIds?: string[];
  setCheckedIds?: Dispatch<SetStateAction<string[]>>;
  setSelectedPropertyId?: Dispatch<SetStateAction<string | null>>;
  boardType?: 'proposals' | 'rewards';
  hideCalculations?: boolean;
};

const TableRowsContainer = forwardRef<HTMLDivElement, { children: ReactNode }>(({ children }, ref) => {
  return (
    <div
      ref={ref as LegacyRef<HTMLDivElement>}
      className='table-row-container'
      style={{
        // Adding 2px margin top to show the drag and drop outline, otherwise the table header blocks it,
        // it can also be achieved via position: relative, zIndex: 1
        // but it changes the position from sticky which might have unknown side-effects
        marginTop: 2
      }}
    >
      {children}
    </div>
  );
});

function Table(props: Props): JSX.Element {
  const {
    board,
    cards,
    activeView,
    visibleGroups,
    groupByProperty,
    views,
    expandSubRowsOnLoad,
    readOnly,
    readOnlyRows,
    rowExpansionLocalStoragePrefix,
    subRowsEmptyValueContent,
    setCheckedIds,
    checkedIds,
    setSelectedPropertyId,
    boardType
  } = props;
  const dispatch = useAppDispatch();
  const selectContainerRef = useRef<HTMLDivElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const areaSelection = useAreaSelection({ readOnly, innerContainer: tableContainerRef });
  const { resetState } = areaSelection;
  const { showConfirmation } = useConfirmationModal();
  const localViewSettings = useLocalDbViewSettings(activeView.id);

  useEffect(() => {
    if (!tableContainerRef.current) {
      tableContainerRef.current = document.querySelector('.drag-area-container');
    }
  }, []);

  useKeydownPress(
    () => {
      setCheckedIds?.([]);
      resetState();
    },
    {
      ctrl: false,
      key: 'Escape',
      shift: false
    }
  );

  const { offset, resizingColumn } = useEfficientDragLayer((monitor) => {
    if (monitor.getItemType() === 'horizontalGrip') {
      return {
        offset: monitor.getDifferenceFromInitialOffset()?.x || 0,
        resizingColumn: monitor.getItem()?.id
      };
    }
    return {
      offset: 0,
      resizingColumn: ''
    };
  });

  const visiblePropertyTemplates = React.useMemo(
    () =>
      activeView.fields.visiblePropertyIds
        .map((id) => board.fields.cardProperties.find((t) => t.id === id))
        .filter((i) => i) as IPropertyTemplate[],
    [board.fields.cardProperties, activeView.fields.visiblePropertyIds]
  );

  const columnRefs = React.useMemo(() => {
    const refs: Map<string, React.RefObject<HTMLDivElement>> = new Map();
    visiblePropertyTemplates.forEach((template) => {
      refs.set(template.id, React.createRef());
    });
    refs.set(Constants.titleColumnId, React.createRef());
    return refs;
  }, [visiblePropertyTemplates]);

  const [, drop] = useDrop<{ id: string }, any, null>(
    () => ({
      accept: 'horizontalGrip',
      drop: async (item, monitor) => {
        const columnWidths = { ...activeView.fields.columnWidths };
        const finalOffset = monitor.getDifferenceFromInitialOffset()?.x || 0;
        const newWidth = Math.max(Constants.minColumnWidth, (columnWidths[item.id] || 0) + (finalOffset || 0));
        if (newWidth !== columnWidths[item.id]) {
          columnWidths[item.id] = newWidth;

          const newView = createBoardView(activeView);
          newView.fields.columnWidths = columnWidths;
          try {
            dispatch(updateView(newView));
            await mutator.updateBlock(newView, activeView, 'resize column');
          } catch {
            dispatch(updateView(activeView));
          }
        }
      }
    }),
    [activeView]
  );

  const onDropToGroupHeader = useCallback(
    async (group: BoardGroup, dstGroup?: BoardGroup) => {
      if (dstGroup) {
        Utils.log(
          `ondrop. Header target: ${dstGroup.option?.value || dstGroup.value}, source: ${
            group?.option?.value || group?.value
          }`
        );

        // Move option to new index
        const visibleOptionIds = visibleGroups.map((o) => o.id);
        const srcIndex = visibleOptionIds.indexOf(dstGroup.id);
        const destIndex = visibleOptionIds.indexOf(group.id);

        visibleOptionIds.splice(srcIndex, 0, visibleOptionIds.splice(destIndex, 1)[0]);
        Utils.log(`ondrop. updated visibleoptionids: ${visibleOptionIds}`);

        await mutator.changeViewVisibleOptionIds(activeView.id, activeView.fields.visibleOptionIds, visibleOptionIds);
      }
    },
    [activeView, visibleGroups]
  );

  const setLocalSort = localViewSettings?.setLocalSort;
  const selectedCardIds = props.selectedCardIds;

  const changeCardGroupProperty = useCallback(
    async (srcCard: Card, groupID: string) => {
      const draggedCardIds = Array.from(new Set(selectedCardIds).add(srcCard.id));
      const description = draggedCardIds.length > 1 ? `drag ${draggedCardIds.length} cards` : 'drag card';
      const cardsById = cards.reduce<{ [key: string]: Card }>((acc, card) => {
        acc[card.id] = card;
        return acc;
      }, {});
      const draggedCards: Card[] = draggedCardIds.map((o: string) => cardsById[o]);

      const awaits = [];
      for (const draggedCard of draggedCards) {
        Utils.log(`draggedCard: ${draggedCard.title}, column: ${draggedCard.fields.properties}`);
        Utils.log(`droppedColumn:  ${groupID}`);
        const oldOptionId = draggedCard.fields.properties[groupByProperty!.id];
        Utils.log(`ondrop. oldValue: ${oldOptionId}`);

        if (groupID !== oldOptionId) {
          awaits.push(mutator.changePropertyValue(draggedCard, groupByProperty!.id, groupID, description));
        }
      }

      await Promise.all(awaits);
    },
    [cards, selectedCardIds, groupByProperty]
  );

  const onDropToGroup = useCallback(
    async (srcCard: Card, groupID: string, dstCardID: string) => {
      Utils.log(`onDropToGroup: ${srcCard.title}`);
      const draggedCardIds = Array.from(new Set(selectedCardIds).add(srcCard.id));
      const description = draggedCardIds.length > 1 ? `drag ${draggedCardIds.length} cards` : 'drag card';
      const hasSort = activeView.fields.sortOptions?.length !== 0;
      if (activeView.fields.groupById !== undefined && groupByProperty && !hasSort) {
        await changeCardGroupProperty(srcCard, groupID);
      }

      let cardOrder = hasSort
        ? cards.map((o) => o.id)
        : Array.from(new Set([...activeView.fields.cardOrder, ...cards.map((o) => o.id)]));

      const destIndex = cardOrder.indexOf(dstCardID);
      cardOrder = cardOrder.filter((id) => !draggedCardIds.includes(id));

      if (hasSort) {
        const { confirmed, cancelled } = await showConfirmation({
          message: 'Would you like to remove sorting?'
        });

        if (confirmed && setLocalSort) {
          await mutator.changeViewSortOptions(activeView.id, activeView.fields.sortOptions, []);
          setLocalSort(null);
          if (activeView.fields.groupById !== undefined && groupByProperty) {
            await changeCardGroupProperty(srcCard, groupID);
          }
        }

        if (cancelled) {
          return;
        }
      }

      // Update dstCard order
      if (dstCardID) {
        cardOrder.splice(destIndex, 0, ...draggedCardIds);
      } else {
        // Find index of first group item
        const firstCard = cards.find((card) => card.fields.properties[activeView.fields.groupById!] === groupID);
        if (firstCard) {
          cardOrder.splice(cardOrder.indexOf(firstCard.id), 0, ...draggedCardIds);
        } else {
          // if not found, this is the only item in group.
          return;
        }
      }

      await mutator.performAsUndoGroup(async () => {
        await mutator.changeViewCardOrder(
          hasSort
            ? {
                ...activeView,
                fields: {
                  ...activeView.fields,
                  sortOptions: []
                }
              }
            : activeView,
          cardOrder,
          description
        );
      });
    },
    [activeView, cards, selectedCardIds, setLocalSort, changeCardGroupProperty, showConfirmation, groupByProperty]
  );

  const onDropToCard = useCallback(
    async (srcCard: Card, dstCard: Card) => {
      Utils.log(`onDropToCard: ${dstCard.title}`);
      await onDropToGroup(srcCard, dstCard.fields.properties[activeView.fields.groupById!] as string, dstCard.id);
      resetState();
    },
    [activeView.fields.groupById, onDropToGroup, resetState]
  );

  const propertyNameChanged = useCallback(
    async (option: IPropertyOption, text: string): Promise<void> => {
      await mutator.changePropertyOptionValue(board, groupByProperty!, option, text);
    },
    [board, groupByProperty]
  );

  return (
    <div className='Table' ref={drop as any}>
      <div className='octo-table-body'>
        <TableHeaders
          board={board}
          cards={cards}
          activeView={activeView}
          views={views}
          offset={offset}
          resizingColumn={resizingColumn}
          columnRefs={columnRefs}
          readOnly={props.readOnly}
          checkedIds={checkedIds}
          setCheckedIds={setCheckedIds}
          setSelectedPropertyId={setSelectedPropertyId}
          boardType={boardType}
        />

        {/* Table rows */}
        <SelectionContext.Provider value={areaSelection}>
          <TableRowsContainer ref={selectContainerRef}>
            {activeView.fields.groupById && (
              <TableGroups
                groups={visibleGroups}
                board={board}
                activeView={activeView}
                groupByProperty={groupByProperty}
                readOnly={props.readOnly}
                columnRefs={columnRefs}
                selectedCardIds={props.selectedCardIds}
                cardIdToFocusOnRender={props.cardIdToFocusOnRender}
                addCard={props.addCard}
                showCard={props.showCard}
                propertyNameChanged={propertyNameChanged}
                onCardClicked={props.onCardClicked}
                onDropToGroupHeader={onDropToGroupHeader}
                onDropToCard={onDropToCard}
                onDropToGroup={onDropToGroup}
                readOnlyTitle={props.readOnlyTitle}
                disableAddingCards={props.disableAddingCards}
                expandSubRowsOnLoad={expandSubRowsOnLoad}
                rowExpansionLocalStoragePrefix={rowExpansionLocalStoragePrefix}
                subRowsEmptyValueContent={subRowsEmptyValueContent}
                checkedIds={checkedIds}
                setCheckedIds={setCheckedIds}
              />
            )}

            {/* No Grouping, Rows, one per card */}
            {!activeView.fields.groupById && (
              <TableRows
                board={board}
                activeView={activeView}
                columnRefs={columnRefs}
                cards={cards}
                selectedCardIds={props.selectedCardIds}
                readOnly={readOnly || !!readOnlyRows}
                cardIdToFocusOnRender={props.cardIdToFocusOnRender}
                offset={offset}
                resizingColumn={resizingColumn}
                showCard={props.showCard}
                addCard={props.addCard}
                onCardClicked={props.onCardClicked}
                onDrop={onDropToCard}
                onDeleteCard={props.onDeleteCard}
                readOnlyTitle={props.readOnlyTitle}
                expandSubRowsOnLoad={expandSubRowsOnLoad}
                rowExpansionLocalStoragePrefix={rowExpansionLocalStoragePrefix}
                subRowsEmptyValueContent={subRowsEmptyValueContent}
                checkedIds={checkedIds}
                setCheckedIds={setCheckedIds}
              />
            )}
          </TableRowsContainer>
        </SelectionContext.Provider>

        {/* Add New row */}
        <div className='octo-table-footer'>
          {!props.readOnly && !activeView.fields.groupById && !props.disableAddingCards && (
            <div
              data-test='table-add-card'
              className='octo-table-cell'
              onClick={() => {
                props.addCard('');
              }}
            >
              <Box display='flex' gap={1} alignItems='center'>
                <Add fontSize='small' />
                <Typography fontSize='small' id='TableComponent.plus-new'>
                  New
                </Typography>
              </Box>
            </div>
          )}
        </div>

        {!props.hideCalculations && (
          <CalculationRow
            board={board}
            cards={cards}
            activeView={activeView}
            resizingColumn={resizingColumn}
            offset={offset}
            readOnly={props.readOnly}
          />
        )}
      </div>
    </div>
  );
}

export default Table;
