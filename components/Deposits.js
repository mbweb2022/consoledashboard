import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { useRouter } from 'next/router';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits(props) {
  const router = useRouter();
  const { ecu, usa } = props
  return (
    <React.Fragment>
      <Title>Resumen de remesas</Title>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        En los últimos 30 días
      </Typography>
      <p></p>
      <Typography component="p" variant="h4">
        US ${ecu}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        de Ecuador a USA
      </Typography>
      <p></p>
      <Typography component="p" variant="h4">
        US ${usa}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        de USA a Ecuador
      </Typography>
      <p></p>
      <div>
        <Link color="primary" href="#" onClick={() => {
          router.push("/transacciones")
        }}>
          Ver todas las transacciones
        </Link>
      </div>
    </React.Fragment>
  );
}