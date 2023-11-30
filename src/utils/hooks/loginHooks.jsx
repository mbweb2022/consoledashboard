import { useEffect } from "react";
export function useAutomaticAuthenticationInit(handleAutomaticLogin, navigate, setLoading) {
    async function initPage() {
        const token = localStorage.getItem('ssTk-mb');
        setLoading(true)
        if (await handleAutomaticLogin(token)) {
            setLoading(false)
            navigate('/home')
        }
        setLoading(false)

    }
    useEffect(() => {
        initPage();
    }, []);
}
