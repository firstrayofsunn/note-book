"use server";


import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";


export async function createNewDocument() {
  auth.protect();

  const { sessionClaims } = await auth();

  const docCollectionRef = adminDb.collection("documents");

  const docRef = await docCollectionRef.add({
    title: "New Doc",
  });

  await adminDb
    .collection("users")
    .doc(sessionClaims?.email!)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: sessionClaims?.email,
      role: "owner",
      createdAt: new Date(),
      eoomId: docRef.id,
    });

  return { docId: docRef.id };
}

export async function deleteDocument(eoomId: string) {
  auth.protect();

  try {
    await adminDb.collection("documents").doc(eoomId).delete();

    const query = await adminDb
      .collectionGroup("rooms")
      .where("eoomId", "==", eoomId)
      .get();

    const batch = adminDb.batch();

    // Delete the room reference in the user's collection for every user in the room
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Delete the room in liveblocks
    await liveblocks.deleteRoom(eoomId);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(eoomId: string, email: string) {
  auth.protect();

  console.log("Invite user to document: ", eoomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(eoomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        eoomId,
      });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function removeUserFromDocument(eoomId: string, email: string) {
  auth.protect();

  console.log("Invite user to document: ", eoomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(eoomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}