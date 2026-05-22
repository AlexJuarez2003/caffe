import { fetchWithAuth } from "./FetchWithAuth";
import { notify } from "../components/Notificacion";

export const cerrarSesion = async (navigate) => {
  try {
    const response = await fetchWithAuth("http://localhost:8000/accounts/logout/", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      localStorage.removeItem("user");
      notify({
        type: "success",
        title: "Sesión terminada",
        message: "Se ha cerrado su sesión adecuadamente.",
        duration: 4000,
      });
      navigate("/login");
    } else {
      notify({
        type: "error",
        title: "Error de conexión",
        message: "No se ha podido comunicar con el servidor.",
        duration: 4000,
      });
    }
  } catch {
    notify({
      type: "error",
      title: "Error de conexión",
      message: "No se ha podido comunicar con el servidor.",
      duration: 4000,
    });
  }
};