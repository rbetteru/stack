import { Table, TableRow, TableCell } from '@mui/material';
import { AccordionCard } from '../../../telemed/components/AccordionCard';
import React, { useState } from 'react';
import { LabOrderHistoryRow } from 'utils/lib/types/data/labs/labs.types';
import { LabsOrderStatusChip } from './ExternalLabsStatusChip';
import { formatDateForLabs } from 'utils';

interface OrderHistoryProps {
  isLoading?: boolean;
  isCollapsed?: boolean;
  orderHistory?: LabOrderHistoryRow[];
  timezone: string | undefined;
}

export const OrderHistoryCard: React.FC<OrderHistoryProps> = ({ isCollapsed = false, orderHistory = [], timezone }) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  return (
    <>
      <AccordionCard
        label={'Order History'}
        collapsed={collapsed}
        withBorder={false}
        onSwitch={() => {
          setCollapsed((prevState) => !prevState);
        }}
      >
        <Table>
          {orderHistory.map((row) => {
            const isReviewOrReceiveAction =
              row.action === 'reviewed' || row.action === 'received' || row.action === 'corrected';
            return (
              <TableRow key={`${row.action}-${row.performer}-${row.date}`}>
                <TableCell>
                  {<LabsOrderStatusChip status={row.action} />}
                  {isReviewOrReceiveAction ? ` (${row.testType})` : ''}
                </TableCell>
                <TableCell>{row.performer ? `by ${row.performer}` : ''}</TableCell>
                <TableCell>{formatDateForLabs(row.date, timezone)}</TableCell>
              </TableRow>
            );
          })}
        </Table>
      </AccordionCard>
    </>
  );
};
