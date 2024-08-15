import crypto from 'crypto';

export const encrypt = (text: string) => {
  const key = process.env.ENCRYPTION_KEY || '';
  console.log(key);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const encryptedString = iv.toString('base64') + ':' + encrypted;
  console.log(encryptedString, text);

  return encryptedString;
};
