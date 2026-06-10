import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './FirebaseDb';
import { auth } from './FirebaseAuth';
import { Notification } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const COLLECTION_NAME = 'notifications';

export const NotificationService = {
  /**
   * Subscribe to real-time notification list (latest 100 entries)
   */
  subscribeToNotifications(onUpdate: (notifications: Notification[]) => void, onError?: (err: Error) => void) {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const notifications: Notification[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          notifications.push({
            id: d.id,
            title: data.title || '',
            description: data.description || '',
            severity: data.severity || 'info',
            category: data.category || 'system',
            isRead: !!data.isRead,
            createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString(),
            userId: data.userId
          });
        });
        onUpdate(notifications);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
        } catch (wrappedErr: any) {
          if (onError) onError(wrappedErr);
        }
      }
    );
  },

  /**
   * Create a new tracking notification
   */
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<void> {
    try {
      await addDoc(collection(db, COLLECTION_NAME), {
        ...notification,
        isRead: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
    }
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(id: string): Promise<void> {
    const path = `${COLLECTION_NAME}/${id}`;
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        isRead: true
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /**
   * Mark all notifications as read inside a batch
   */
  async markAllAsRead(notifications: Notification[]): Promise<void> {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;

    try {
      const batch = writeBatch(db);
      unread.forEach((n) => {
        batch.update(doc(db, COLLECTION_NAME, n.id), { isRead: true });
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
    }
  },

  /**
   * Clear (delete) all resolved/read notifications
   */
  async clearAllNotifications(notifications: Notification[]): Promise<void> {
    if (notifications.length === 0) return;

    try {
      const batch = writeBatch(db);
      notifications.forEach((n) => {
         batch.delete(doc(db, COLLECTION_NAME, n.id));
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, COLLECTION_NAME);
    }
  },

  /**
   * Inject high-fidelity simulations for demonstration and user testing
   */
  async triggerSimulatedNotification(category: string, severity: string): Promise<void> {
    let title = '';
    let description = '';

    switch (category) {
      case 'sheets':
        title = 'Google Sheets Sync Completed';
        description = `Dynamic synchronization finished. Transferred 7 new item rows securely into Google Apps Script master ledger. Status is 200 OK.`;
        break;
      case 'sales':
        const rValue = Math.floor(Math.random() * 90000) + 10000;
        title = `Proforma Invoice PI-2026-${Math.floor(Math.random() * 899) + 100} Completed`;
        description = `Customer agreement approved. Credit boundary verified. Estimated CIF value is $${rValue.toLocaleString()} USD waiting for down payment log.`;
        break;
      case 'oem':
        title = 'New Factory PO Issued (OEM)';
        description = 'Issue Factory Procurement Order #PO-F8821 received and queued by production managers at Chiang Mai branch.';
        break;
      case 'calendar':
        title = 'HR Calendar Update';
        description = 'Employee scheduling changed: Scheduled audit operations relocated to next weekend. Please update your agendas.';
        break;
      case 'logistics':
        title = 'Booking Confirmation Confirmed';
        description = 'Carrier: MCC SIBU Voyage 2405S. Container capacity: 2x 40ft HQ dry containers confirmed for loading on port of Bangkok.';
        break;
      default:
        title = 'System Operation Logged';
        description = `Administrator updated user access flags. Audit logs triggered. Security score stands at 99%.`;
        break;
    }

    if (severity === 'critical') {
      title = `CRITICAL: ${title}`;
      description = `ALERT: Unusual operation boundary detected. ${description}`;
    }

    await this.createNotification({
      title,
      description,
      category: category as any,
      severity: severity as any
    });
  }
};
