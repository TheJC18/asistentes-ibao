import { FirebaseDB } from '@/firebase/config';
import { EventData } from '@/modules/events/types';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';

export async function createEvent(event: EventData) {
  const docRef = await addDoc(collection(FirebaseDB, 'events'), {
    ...event,
    date: Timestamp.fromDate(new Date(event.date)),
    createdAt: Timestamp.now(),
    id: '', // Temporal, se actualiza después
  });
  // Actualizar el campo id en el documento
  await updateDoc(docRef, { id: docRef.id });
  return { ...event, id: docRef.id };
}

export async function getEvents() {
  const querySnapshot = await getDocs(collection(FirebaseDB, 'events'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.().toISOString?.() || '',
  })) as EventData[];
}

export async function getEventById(id: string) {
  const docRef = doc(FirebaseDB, 'events', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    date: data.date?.toDate?.().toISOString?.() || '',
  } as EventData;
}

export async function updateEvent(id: string, event: Partial<EventData>) {
  const docRef = doc(FirebaseDB, 'events', id);
  await updateDoc(docRef, {
    ...event,
    ...(event.date ? { date: Timestamp.fromDate(new Date(event.date)) } : {}),
    updatedAt: Timestamp.now(),
  });
}

export async function deleteEvent(id: string) {
  const docRef = doc(FirebaseDB, 'events', id);
  await deleteDoc(docRef);
}