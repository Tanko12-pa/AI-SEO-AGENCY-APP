import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { auth, db, googleAuthProvider } from "../firebase";
import {
  KeywordItem,
  CompetitorItem,
  ContentPieceItem,
  LocalCitationItem,
  AudioTranscriptItem,
  CampaignLogItem,
  InvoiceRecord,
  AuthAccount,
} from "../types";

// Collection Names matching firebase-blueprint.json
export const COLLECTIONS = {
  USERS: "users",
  KEYWORDS: "keywords",
  COMPETITORS: "competitors",
  CONTENT_PIECES: "content_pieces",
  LOCAL_CITATIONS: "local_citations",
  AUDIO_TRANSCRIPTS: "audio_transcripts",
  CAMPAIGN_LOGS: "campaign_logs",
  INVOICES: "invoices",
} as const;

// -------------------------------------------------------------
// USER PROFILE FIRESTORE OPERATIONS
// -------------------------------------------------------------

export async function saveUserProfileToFirestore(user: AuthAccount): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, user.id);
    await setDoc(
      userRef,
      {
        ...user,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Firestore saveUserProfile error (offline fallback used):", error);
  }
}

export async function getUserProfileFromFirestore(userId: string): Promise<AuthAccount | null> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as AuthAccount;
    }
    return null;
  } catch (error) {
    console.warn("Firestore getUserProfile error:", error);
    return null;
  }
}

export function subscribeUserProfile(
  userId: string,
  onUpdate: (user: AuthAccount | null) => void
): () => void {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    return onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as AuthAccount);
        } else {
          onUpdate(null);
        }
      },
      (error) => {
        console.warn("Firestore subscribeUserProfile snapshot error:", error);
      }
    );
  } catch (err) {
    console.warn("Firestore subscribeUserProfile error:", err);
    return () => {};
  }
}

// -------------------------------------------------------------
// REAL-TIME FIRESTORE DATA SYNC HELPERS
// -------------------------------------------------------------

// --- KEYWORDS ---
export function subscribeKeywords(
  onData: (items: KeywordItem[]) => void
): () => void {
  try {
    const colRef = collection(db, COLLECTIONS.KEYWORDS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: KeywordItem[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as KeywordItem),
            id: doc.id,
          }));
          onData(items);
        }
      },
      (err) => console.warn("Firestore subscribeKeywords snapshot error:", err)
    );
  } catch (e) {
    console.warn("Firestore subscribeKeywords error:", e);
    return () => {};
  }
}

export async function saveKeywordToFirestore(keyword: KeywordItem): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.KEYWORDS, keyword.id);
    await setDoc(docRef, keyword, { merge: true });
  } catch (e) {
    console.warn("Firestore saveKeyword error:", e);
  }
}

export async function deleteKeywordFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.KEYWORDS, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn("Firestore deleteKeyword error:", e);
  }
}

export async function bulkDeleteKeywordsFromFirestore(ids: string[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      const docRef = doc(db, COLLECTIONS.KEYWORDS, id);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (e) {
    console.warn("Firestore bulkDeleteKeywords error:", e);
  }
}

// --- COMPETITORS ---
export function subscribeCompetitors(
  onData: (items: CompetitorItem[]) => void
): () => void {
  try {
    const colRef = collection(db, COLLECTIONS.COMPETITORS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: CompetitorItem[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as CompetitorItem),
            id: doc.id,
          }));
          onData(items);
        }
      },
      (err) => console.warn("Firestore subscribeCompetitors error:", err)
    );
  } catch (e) {
    console.warn("Firestore subscribeCompetitors error:", e);
    return () => {};
  }
}

export async function saveCompetitorToFirestore(competitor: CompetitorItem): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.COMPETITORS, competitor.id);
    await setDoc(docRef, competitor, { merge: true });
  } catch (e) {
    console.warn("Firestore saveCompetitor error:", e);
  }
}

export async function deleteCompetitorFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.COMPETITORS, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn("Firestore deleteCompetitor error:", e);
  }
}

// --- CONTENT PIECES ---
export function subscribeContentPieces(
  onData: (items: ContentPieceItem[]) => void
): () => void {
  try {
    const colRef = collection(db, COLLECTIONS.CONTENT_PIECES);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: ContentPieceItem[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as ContentPieceItem),
            id: doc.id,
          }));
          onData(items);
        }
      },
      (err) => console.warn("Firestore subscribeContentPieces error:", err)
    );
  } catch (e) {
    console.warn("Firestore subscribeContentPieces error:", e);
    return () => {};
  }
}

export async function saveContentPieceToFirestore(piece: ContentPieceItem): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.CONTENT_PIECES, piece.id);
    await setDoc(docRef, piece, { merge: true });
  } catch (e) {
    console.warn("Firestore saveContentPiece error:", e);
  }
}

export async function deleteContentPieceFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.CONTENT_PIECES, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn("Firestore deleteContentPiece error:", e);
  }
}

// --- LOCAL CITATIONS ---
export function subscribeCitations(
  onData: (items: LocalCitationItem[]) => void
): () => void {
  try {
    const colRef = collection(db, COLLECTIONS.LOCAL_CITATIONS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: LocalCitationItem[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as LocalCitationItem),
            id: doc.id,
          }));
          onData(items);
        }
      },
      (err) => console.warn("Firestore subscribeCitations error:", err)
    );
  } catch (e) {
    console.warn("Firestore subscribeCitations error:", e);
    return () => {};
  }
}

export async function saveCitationToFirestore(citation: LocalCitationItem): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.LOCAL_CITATIONS, citation.id);
    await setDoc(docRef, citation, { merge: true });
  } catch (e) {
    console.warn("Firestore saveCitation error:", e);
  }
}

export async function deleteCitationFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.LOCAL_CITATIONS, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn("Firestore deleteCitation error:", e);
  }
}

// --- AUDIO TRANSCRIPTS ---
export function subscribeTranscripts(
  onData: (items: AudioTranscriptItem[]) => void
): () => void {
  try {
    const colRef = collection(db, COLLECTIONS.AUDIO_TRANSCRIPTS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: AudioTranscriptItem[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as AudioTranscriptItem),
            id: doc.id,
          }));
          onData(items);
        }
      },
      (err) => console.warn("Firestore subscribeTranscripts error:", err)
    );
  } catch (e) {
    console.warn("Firestore subscribeTranscripts error:", e);
    return () => {};
  }
}

export async function saveTranscriptToFirestore(transcript: AudioTranscriptItem): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.AUDIO_TRANSCRIPTS, transcript.id);
    await setDoc(docRef, transcript, { merge: true });
  } catch (e) {
    console.warn("Firestore saveTranscript error:", e);
  }
}

export async function deleteTranscriptFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.AUDIO_TRANSCRIPTS, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn("Firestore deleteTranscript error:", e);
  }
}

// --- CAMPAIGN LOGS ---
export function subscribeCampaignLogs(
  onData: (items: CampaignLogItem[]) => void
): () => void {
  try {
    const colRef = collection(db, COLLECTIONS.CAMPAIGN_LOGS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: CampaignLogItem[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as CampaignLogItem),
            id: doc.id,
          }));
          onData(items);
        }
      },
      (err) => console.warn("Firestore subscribeCampaignLogs error:", err)
    );
  } catch (e) {
    console.warn("Firestore subscribeCampaignLogs error:", e);
    return () => {};
  }
}

export async function addCampaignLogToFirestore(log: CampaignLogItem): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.CAMPAIGN_LOGS, log.id);
    await setDoc(docRef, log, { merge: true });
  } catch (e) {
    console.warn("Firestore addCampaignLog error:", e);
  }
}

export async function deleteCampaignLogFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.CAMPAIGN_LOGS, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn("Firestore deleteCampaignLog error:", e);
  }
}

// --- INVOICES ---
export function subscribeInvoices(
  onData: (items: InvoiceRecord[]) => void
): () => void {
  try {
    const colRef = collection(db, COLLECTIONS.INVOICES);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: InvoiceRecord[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as InvoiceRecord),
            id: doc.id,
          }));
          onData(items);
        }
      },
      (err) => console.warn("Firestore subscribeInvoices error:", err)
    );
  } catch (e) {
    console.warn("Firestore subscribeInvoices error:", e);
    return () => {};
  }
}

export async function saveInvoiceToFirestore(invoice: InvoiceRecord): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.INVOICES, invoice.id);
    await setDoc(docRef, invoice, { merge: true });
  } catch (e) {
    console.warn("Firestore saveInvoice error:", e);
  }
}

// -------------------------------------------------------------
// BATCH INITIAL SEEDING HELPER
// -------------------------------------------------------------
export async function seedInitialFirestoreData(data: {
  keywords: KeywordItem[];
  competitors: CompetitorItem[];
  contentPieces: ContentPieceItem[];
  citations: LocalCitationItem[];
  transcripts: AudioTranscriptItem[];
  campaignLogs: CampaignLogItem[];
  invoices?: InvoiceRecord[];
}): Promise<{ success: boolean; count: number }> {
  try {
    const batch = writeBatch(db);
    let count = 0;

    data.keywords.forEach((kw) => {
      const ref = doc(db, COLLECTIONS.KEYWORDS, kw.id);
      batch.set(ref, kw, { merge: true });
      count++;
    });

    data.competitors.forEach((c) => {
      const ref = doc(db, COLLECTIONS.COMPETITORS, c.id);
      batch.set(ref, c, { merge: true });
      count++;
    });

    data.contentPieces.forEach((cp) => {
      const ref = doc(db, COLLECTIONS.CONTENT_PIECES, cp.id);
      batch.set(ref, cp, { merge: true });
      count++;
    });

    data.citations.forEach((cit) => {
      const ref = doc(db, COLLECTIONS.LOCAL_CITATIONS, cit.id);
      batch.set(ref, cit, { merge: true });
      count++;
    });

    data.transcripts.forEach((t) => {
      const ref = doc(db, COLLECTIONS.AUDIO_TRANSCRIPTS, t.id);
      batch.set(ref, t, { merge: true });
      count++;
    });

    data.campaignLogs.forEach((cl) => {
      const ref = doc(db, COLLECTIONS.CAMPAIGN_LOGS, cl.id);
      batch.set(ref, cl, { merge: true });
      count++;
    });

    if (data.invoices) {
      data.invoices.forEach((inv) => {
        const ref = doc(db, COLLECTIONS.INVOICES, inv.id);
        batch.set(ref, inv, { merge: true });
        count++;
      });
    }

    await batch.commit();
    return { success: true, count };
  } catch (err) {
    console.error("Firestore batch seeding failed:", err);
    return { success: false, count: 0 };
  }
}

// -------------------------------------------------------------
// FIREBASE AUTH HELPERS
// -------------------------------------------------------------

export async function firebaseSignUpWithEmail(
  email: string,
  pass: string,
  displayName?: string
): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && cred.user) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

export async function firebaseSignInWithEmail(
  email: string,
  pass: string
): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

export async function firebaseSignInWithGoogle(): Promise<FirebaseUser> {
  const cred = await signInWithPopup(auth, googleAuthProvider);
  return cred.user;
}

export async function firebaseSendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function firebaseSignOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export function subscribeAuthState(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
