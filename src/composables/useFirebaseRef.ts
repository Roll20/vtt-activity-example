import { ref } from 'firebase/database'
import { db } from '../database';

const useFirebaseRef = (campaignStoragePath: string) => {
    const parentRef = ref(db, campaignStoragePath);

    return {
        parentRef
    };
};

export { useFirebaseRef };
export default useFirebaseRef;
