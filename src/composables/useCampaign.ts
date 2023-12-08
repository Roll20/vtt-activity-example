import { 
    child,
    get,
} from 'firebase/database';
import { useFirebaseRef } from './useFirebaseRef';

const useCampaign = (storagePath: string) => {
    const { parentRef } = useFirebaseRef(storagePath)
    const campaign = child(parentRef, 'campaign');

    const getCampaign = async () => {
        const snapshot = await get(campaign);
        let value = null;
        if (snapshot.exists()) {
            value = snapshot.val()
            console.log({ value });
        } else {
            console.log("No data available");
        }
        return value;
    }

    return { 
        campaignRef: campaign,
        getCampaign,
     };
}

export { useCampaign };
export default useCampaign;
