// src/hooks/useUserData.js

import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const useUserData = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    } else {
                        setError('No user data found.');
                    }
                } catch (err) {
                    console.error('Error fetching user data:', err);
                    setError('Failed to fetch user data.');
                }
            } else {
                setError('No user is logged in.');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { userData, loading, error };
};

export default useUserData;
