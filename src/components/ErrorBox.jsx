import React, { useContext, useRef } from 'react';
import useDashboardContext from '../utils/contexts/DashboardContext'; // Importa el contexto

function ErrorBox() {
    const { error, setError } = useDashboardContext();
    const intervalRef = useRef(null);


    React.useEffect(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
    
        if (error.trim().length !== 0) {
          intervalRef.current = setInterval(() => {
            setError('');
          }, 6000);
        }
    
        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        };
      }, [error, setError]);


    if (error.trim().length != 0) {
        return (
            <div
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    color: 'red',
                    border: '2px solid red',
                    padding: '10px',
                    borderRadius: '5px',
                }}
            >
                {error}
            </div>
        );
    }

    return null;
}

export default ErrorBox;
