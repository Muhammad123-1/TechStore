import { useEffect, useState } from "react";
import SecurityLoader from "../components/common/SecurityLoader";
import NotFound from "./NotFound";

export default function NotFoundWithLoader() {
    // If the app just finished its initial security check, don't show it again immediately
    const [loading, setLoading] = useState(!window.__techstore_initial_check_done);

    useEffect(() => {
        // Show SecurityLoader for 2.5 seconds to create a premium "processing" feel
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <SecurityLoader />;
    }

    return <NotFound />;
}
