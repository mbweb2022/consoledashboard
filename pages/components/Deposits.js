import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {
  return (
    <React.Fragment>
      <Title>Finanzas</Title>
      <Typography component="p" variant="h4">
        $0,000.00
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        al 22 de Noviembre, 2022
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Ver finanzas
        </Link>
      </div>
    </React.Fragment>
  );
}