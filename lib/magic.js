import { Magic } from '@magic-sdk/admin';

export const mAdmin = new Magic(process.env.NEXT_PUBLIC_MAGIC_SECRET_API_KEY);
