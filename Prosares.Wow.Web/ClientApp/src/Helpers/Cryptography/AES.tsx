import CryptoJS from "crypto-js";

export function Encrypt(value: any) {
    const encryptedString =  CryptoJS.AES.encrypt(value, "").toString();
    return encryptedString;
}


export async function Decrypt(value: any) {
    const decryptedWordArray = CryptoJS.AES.decrypt(value, "");
    const decryptedString = await decryptedWordArray.toString(CryptoJS.enc.Utf8);
    return decryptedString;
}
