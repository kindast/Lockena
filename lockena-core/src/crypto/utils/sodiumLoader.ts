import sodium from "libsodium-wrappers-sumo";

let isInitialized = false;

export const sodiumLoader = {
  async initSodium(): Promise<void> {
    if (isInitialized) return;
    await sodium.ready;
    isInitialized = true;
  },
  getSodium() {
    if (!isInitialized) {
      throw new Error("Sodium is not initialized. Call initSodium() first.");
    }
    return sodium;
  },
  wipeMemory(array: Uint8Array) {
    sodium.memzero(array);
  },
};
