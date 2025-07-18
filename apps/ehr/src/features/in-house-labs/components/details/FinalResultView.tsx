import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { InHouseOrderDetailPageItemDTO } from 'utils/lib/types/data/in-house/in-house.types';
import { getFormattedDiagnoses, DiagnosisDTO } from 'utils';
import { FinalResultCard } from './FinalResultCard';
import { useNavigate } from 'react-router-dom';

interface FinalResultViewProps {
  testDetails: InHouseOrderDetailPageItemDTO[] | undefined;
  onBack: () => void;
}

export const FinalResultView: React.FC<FinalResultViewProps> = ({ testDetails, onBack }) => {
  const navigate = useNavigate();

  const diagnoses = testDetails?.reduce((acc: DiagnosisDTO[], detail) => {
    detail.diagnosesDTO.forEach((diagnoses) => {
      if (!acc.some((d) => d.code === diagnoses.code)) {
        acc.push(diagnoses);
      }
    });
    return acc;
  }, []);

  const isRepeatable = testDetails?.some((detail) => detail.labDetails.repeatable);
  const handleRepeatOnClick = (): void => {
    navigate(`/in-person/${testDetails?.[0].appointmentId}/in-house-lab-orders/create`, {
      state: {
        testItemName: testDetails?.[0]?.testItemName,
        diagnoses: diagnoses,
      },
    });
  };

  if (!testDetails) {
    return (
      <Box>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Test details not found
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
        {getFormattedDiagnoses(diagnoses || [])}
      </Typography>

      {testDetails.map((test, idx) => (
        <FinalResultCard key={`${idx}-${test.testItemName.split(' ').join('')}`} testDetails={test} />
      ))}

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
        <Button variant="outlined" onClick={onBack} sx={{ borderRadius: '50px', px: 4 }}>
          Back
        </Button>
        {isRepeatable && (
          <Button variant="outlined" onClick={handleRepeatOnClick} sx={{ borderRadius: '50px', px: 4 }}>
            Repeat
          </Button>
        )}
      </Box>
    </Box>
  );
};
