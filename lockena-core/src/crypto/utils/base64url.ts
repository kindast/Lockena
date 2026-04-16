export const base64url = {
  encode(buffer: ArrayBuffer | Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  },

  decode(base64url: string): Uint8Array {
    let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  },
};
