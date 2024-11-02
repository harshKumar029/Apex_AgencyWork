// src/hooks/useUserData.js

import { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Adjust the import paths as needed
import { doc, getDoc } from 'firebase/firestore';

const useUserData = () => {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    let data = {};
                    if (userDoc.exists()) {
                        data = userDoc.data();
                    }

                    // Fetch profile details from subcollection
                    const profileDocRef = doc(db, 'users', user.uid, 'Details&Documents', 'ProfileDetails');
                    const profileDoc = await getDoc(profileDocRef);

                    if (profileDoc.exists()) {
                        data = { ...data, ...profileDoc.data() };
                    }

                    setUserData(data);
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { userData, loading, error };
};

export default useUserData;
