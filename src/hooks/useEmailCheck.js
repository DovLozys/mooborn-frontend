import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { API_URL } from "../config";

function useEmailCheck() {
    const [emailFound, setEmailFound] = useState(false);
    const { user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        async function findEmailInDB() {
            const token = await getAccessTokenSilently();
            const res = await fetch(`${API_URL}/users/email/${user.email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            
            if (data.payload.length > 0) {
                setEmailFound(true);
            }
        }

        findEmailInDB();
    }, [user.email, getAccessTokenSilently]);

    return [emailFound];
}

export { useEmailCheck };
