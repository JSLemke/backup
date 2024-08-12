import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../my-supabase-auth-server/supabase';

export const generateFamilyCode = async (familyName) => {
  const familyCode = `${familyName}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  await setDoc(doc(db, 'familyCodes', familyCode), {
    familyName: familyName,
    createdAt: new Date(),
  });
  
  return familyCode;
};
