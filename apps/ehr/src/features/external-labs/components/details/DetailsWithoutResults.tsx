import React from 'react';
import { Typography, Stack, Grid } from '@mui/material';
import { OrderCollection } from '../OrderCollection';
import { CSSPageTitle } from '../../../../telemed/components/PageTitle';
import { LabOrderDetailedPageDTO, SpecimenDateChangedParameters } from 'utils';
import { LabsOrderStatusChip } from '../ExternalLabsStatusChip';

export const DetailsWithoutResults: React.FC<{
  labOrder: LabOrderDetailedPageDTO;
  saveSpecimenDate: (params: SpecimenDateChangedParameters) => Promise<void>;
}> = ({ labOrder, saveSpecimenDate }) => {
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <CSSPageTitle>{labOrder.testItem}</CSSPageTitle>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1">{labOrder.diagnoses}</Typography>
        <Grid container justifyContent="end" spacing={2}>
          <Grid item>
            <Typography variant="body1">{labOrder.isPSC ? 'PSC' : ''}</Typography>
          </Grid>
          <Grid item>
            <LabsOrderStatusChip status={labOrder.orderStatus} />
          </Grid>
        </Grid>
      </Stack>
      {/* {taskStatus === 'pending' && (
          <TaskBanner
            orderName={labOrder.testItem}
            orderingPhysician={labOrder.orderingPhysician}
            orderedOnDate={labOrder.orderAddedDate}
            labName={labOrder?.fillerLab}
            taskStatus={taskStatus}
          />
        )} */}
      <OrderCollection
        labOrder={labOrder}
        showOrderInfo={labOrder.orderStatus === 'sent'}
        saveSpecimenDate={saveSpecimenDate}
      />
    </Stack>
  );
};
