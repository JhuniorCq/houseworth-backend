import admin from "../config/firebase.js";

export const deleteUserById = async (uid) => {
  try {
    await admin.auth().deleteUser(uid);

    console.log(`Usuario con UID '${uid}' eliminado correctamente`);
  } catch (error) {
    console.error(`Error al eliminar el usuario '${uid}': `, error);
  }
};
