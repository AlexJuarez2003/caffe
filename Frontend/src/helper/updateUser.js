import { useState } from "react";

export async function updateUser() {
    
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchWithAuth("http://localhost:8000/accounts/profile/customer/", {
        method: "GET",
        })
        .then((res) => {
            if (!res || !res.ok) throw new Error("Not authenticated");
            return res.json();
        })
        .then((data) => {
            setUser(data);
            localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(user));
        })
        .catch(() => {
            console.log("Error")
        });
    }, []);

};