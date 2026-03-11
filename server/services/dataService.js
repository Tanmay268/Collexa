import { admin, db } from '../config/firebase.js';

const usersCollection = db.collection('users');
const userEmailsCollection = db.collection('userEmails');
const listingsCollection = db.collection('listings');
const reportsCollection = db.collection('reports');
const otpsCollection = db.collection('otps');
const blockedEmailsCollection = db.collection('blockedEmails');

const isTimestamp = (value) =>
  value &&
  typeof value === 'object' &&
  typeof value.toDate === 'function' &&
  typeof value.toMillis === 'function';

const serializeValue = (value) => {
  if (value === null || value === undefined) return value;
  if (isTimestamp(value)) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, serializeValue(nestedValue)])
    );
  }
  return value;
};

const docToObject = (doc) => ({
  _id: doc.id,
  id: doc.id,
  ...serializeValue(doc.data()),
});

const stripUndefined = (data) =>
  Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));

const buildPage = (items, page = 1, limit = 20) => {
  const normalizedPage = Number(page) || 1;
  const normalizedLimit = Number(limit) || 20;
  const start = (normalizedPage - 1) * normalizedLimit;
  return {
    items: items.slice(start, start + normalizedLimit),
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / normalizedLimit)),
    currentPage: normalizedPage,
  };
};

export const getCollectionRefs = () => ({
  usersCollection,
  userEmailsCollection,
  listingsCollection,
  reportsCollection,
  otpsCollection,
  blockedEmailsCollection,
});

export const now = () => new Date();

export const createUser = async ({ email, ...data }) => {
  const normalizedEmail = email.toLowerCase().trim();

  return db.runTransaction(async (transaction) => {
    const emailRef = userEmailsCollection.doc(normalizedEmail);
    const existingEmail = await transaction.get(emailRef);

    if (existingEmail.exists) {
      const error = new Error('Email already registered. Please login.');
      error.status = 409;
      throw error;
    }

    const userRef = usersCollection.doc();
    const timestamp = now();

    transaction.set(userRef, {
      ...stripUndefined(data),
      email: normalizedEmail,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    transaction.set(emailRef, {
      userId: userRef.id,
      createdAt: timestamp,
    });

    return {
      _id: userRef.id,
      id: userRef.id,
      ...serializeValue({
        ...stripUndefined(data),
        email: normalizedEmail,
        createdAt: timestamp,
        updatedAt: timestamp,
      }),
    };
  });
};

export const getUserById = async (userId) => {
  const doc = await usersCollection.doc(userId).get();
  return doc.exists ? docToObject(doc) : null;
};

export const getUserByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const snapshot = await usersCollection.where('email', '==', normalizedEmail).limit(1).get();
  return snapshot.empty ? null : docToObject(snapshot.docs[0]);
};

export const isEmailBlocked = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const doc = await blockedEmailsCollection.doc(normalizedEmail).get();
  return doc.exists;
};

export const blockEmailAddress = async (email, meta = {}) => {
  const normalizedEmail = email.toLowerCase().trim();
  await blockedEmailsCollection.doc(normalizedEmail).set({
    email: normalizedEmail,
    blockedAt: now(),
    ...stripUndefined(meta),
  });
};

export const unblockEmailAddress = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  await blockedEmailsCollection.doc(normalizedEmail).delete();
};

export const listBlockedEmails = async () => {
  const snapshot = await blockedEmailsCollection.get();
  return snapshot.docs
    .map(docToObject)
    .sort((a, b) => new Date(b.blockedAt) - new Date(a.blockedAt));
};

export const updateUser = async (userId, data) => {
  const payload = stripUndefined({ ...data, updatedAt: now() });
  await usersCollection.doc(userId).set(payload, { merge: true });
  return getUserById(userId);
};

export const listUsers = async () => {
  const snapshot = await usersCollection.get();
  return snapshot.docs
    .map(docToObject)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const saveOTP = async (email, otp) => {
  const normalizedEmail = email.toLowerCase().trim();
  const createdAt = now();
  const expiresAt = new Date(createdAt.getTime() + 10 * 60 * 1000);

  await otpsCollection.doc(normalizedEmail).set({
    email: normalizedEmail,
    otp,
    createdAt,
    expiresAt,
  });
};

export const getOTP = async (email, otp) => {
  const normalizedEmail = email.toLowerCase().trim();
  const doc = await otpsCollection.doc(normalizedEmail).get();
  if (!doc.exists) return null;

  const otpRecord = docToObject(doc);
  if (otpRecord.otp !== otp) return null;
  if (new Date(otpRecord.expiresAt) < new Date()) {
    await otpsCollection.doc(normalizedEmail).delete();
    return null;
  }

  return otpRecord;
};

export const deleteOTP = async (email) => {
  await otpsCollection.doc(email.toLowerCase().trim()).delete();
};

export const createListingRecord = async (data) => {
  const ref = listingsCollection.doc();
  const timestamp = now();

  await ref.set({
    ...stripUndefined(data),
    status: 'active',
    expiresAt: new Date(timestamp.getTime() + 30 * 24 * 60 * 60 * 1000),
    viewCount: 0,
    reportCount: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return getListingById(ref.id);
};

export const getListingById = async (listingId) => {
  const doc = await listingsCollection.doc(listingId).get();
  return doc.exists ? docToObject(doc) : null;
};

export const updateListingRecord = async (listingId, data) => {
  await listingsCollection.doc(listingId).set(
    stripUndefined({
      ...data,
      updatedAt: now(),
    }),
    { merge: true }
  );

  return getListingById(listingId);
};

export const incrementListingViewCount = async (listingId) => {
  await listingsCollection.doc(listingId).set(
    {
      viewCount: admin.firestore.FieldValue.increment(1),
      updatedAt: now(),
    },
    { merge: true }
  );
};

export const incrementListingReportCount = async (listingId) => {
  await listingsCollection.doc(listingId).set(
    {
      reportCount: admin.firestore.FieldValue.increment(1),
      updatedAt: now(),
    },
    { merge: true }
  );
};

export const listAllListings = async () => {
  const snapshot = await listingsCollection.get();
  return snapshot.docs
    .map(docToObject)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const syncExpiredListings = async () => {
  const listings = await listAllListings();
  const expiredListingIds = listings
    .filter((listing) => listing.status === 'active' && new Date(listing.expiresAt) < new Date())
    .map((listing) => listing._id);

  if (expiredListingIds.length > 0) {
    const batch = db.batch();
    expiredListingIds.forEach((listingId) => {
      batch.set(
        listingsCollection.doc(listingId),
        {
          status: 'expired',
          updatedAt: now(),
        },
        { merge: true }
      );
    });
    await batch.commit();
  }

  return listings.map((listing) =>
    expiredListingIds.includes(listing._id) ? { ...listing, status: 'expired' } : listing
  );
};

export const createReportRecord = async ({ listingId, reportedBy, reason, description }) => {
  const reportId = `${listingId}_${reportedBy}`;
  const reportRef = reportsCollection.doc(reportId);
  const existing = await reportRef.get();

  if (existing.exists) {
    const error = new Error('You have already reported this listing');
    error.status = 409;
    throw error;
  }

  const timestamp = now();
  await reportRef.set({
    listingId,
    reportedBy,
    reason,
    description: description || '',
    status: 'pending',
    reviewedBy: null,
    reviewNote: '',
    reviewedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return getReportById(reportId);
};

export const getReportById = async (reportId) => {
  const doc = await reportsCollection.doc(reportId).get();
  return doc.exists ? docToObject(doc) : null;
};

export const updateReportRecord = async (reportId, data) => {
  await reportsCollection.doc(reportId).set(
    stripUndefined({
      ...data,
      updatedAt: now(),
    }),
    { merge: true }
  );

  return getReportById(reportId);
};

export const listReports = async () => {
  const snapshot = await reportsCollection.get();
  return snapshot.docs
    .map(docToObject)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const paginate = buildPage;
