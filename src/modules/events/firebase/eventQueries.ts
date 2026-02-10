import { FirebaseDB } from '@/firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';

export interface EventData {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  type?: string;
  color?: string;
  createdBy: string;
}

const EVENTS_COLLECTION = 'events';

export async function createEvent(event: EventData) {
  const docRef = await addDoc(collection(FirebaseDB, EVENTS_COLLECTION), {
    ...event,
    date: Timestamp.fromDate(new Date(event.date)),
    createdAt: Timestamp.now(),
  });
  return { ...event, id: docRef.id };
}

export async function getEvents() {
  const querySnapshot = await getDocs(collection(FirebaseDB, EVENTS_COLLECTION));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.().toISOString?.() || '',
  })) as EventData[];
}

export async function getEventById(id: string) {
  const docRef = doc(FirebaseDB, EVENTS_COLLECTION, id);
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
  const docRef = doc(FirebaseDB, EVENTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...event,
    ...(event.date ? { date: Timestamp.fromDate(new Date(event.date)) } : {}),
    updatedAt: Timestamp.now(),
  });
}

export async function deleteEvent(id: string) {
  const docRef = doc(FirebaseDB, EVENTS_COLLECTION, id);
  await deleteDoc(docRef);
}
