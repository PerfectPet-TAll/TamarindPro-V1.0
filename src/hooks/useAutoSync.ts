import { useState, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';

const MOCK_PI_DATABASE: Record<string, any> = {
  'PI-2024-001': {
    piNo: 'PI-2024-001',
    customerRef: 'REF-001',
    poNo: 'PO-001',
    vessel: 'OOCL BRISBANE V.227S',
    portOfLoading: 'LAEM CHABANG, THAILAND',
    portOfDischarge: 'MELBOURNE, AUSTRALIA',
    consignee: 'GLOBAL FOODS LTD',
  },
  'PI-2024-002': {
    piNo: 'PI-2024-002',
    customerRef: 'REF-002',
    poNo: 'PO-002',
    vessel: 'MSC VANESSA',
    portOfLoading: 'BANGKOK, THAILAND',
    portOfDischarge: 'LOS ANGELES, USA',
    consignee: 'US TRADING LLC',
  }
};

export function useAutoSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { showNotification } = useNotification();

  const syncByPINumber = useCallback(async (piNumber: string): Promise<any | null> => {
    setIsSyncing(true);
    showNotification(`Syncing data for PI: ${piNumber}...`, 'info');
    
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsSyncing(false);
        const data = MOCK_PI_DATABASE[piNumber];
        if (data) {
          showNotification(`Successfully populated data from ${piNumber}`, 'success');
          resolve(data);
        } else {
          showNotification(`PI Number ${piNumber} not found`, 'error');
          resolve(null);
        }
      }, 800);
    });
  }, [showNotification]);

  return { isSyncing, syncByPINumber };
}
