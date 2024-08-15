import CryptoJS from "crypto-js";

export function decrypt(text: string) {
  try {
    const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";

    const parts = text.split(":");
    const iv = CryptoJS.enc.Utf8.parse(parts[0]);
    const key = CryptoJS.enc.Utf8.parse(encryptionKey);
    const ciphertext = CryptoJS.enc.Utf8.parse(parts[1]);

    // Create a CipherParams object that includes the ciphertext and IV
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: ciphertext,
      iv: iv,
    });

    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    //  return decrypted.toString(CryptoJS.enc.Utf8);
    console.log(
      key,
      iv,
      ciphertext,
      //   encrypted,
      decrypted,
      decrypted.toString()
    );
    console.log(decrypted.toString(CryptoJS.enc.Utf8));

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error(err);
    return null;
  }
}
