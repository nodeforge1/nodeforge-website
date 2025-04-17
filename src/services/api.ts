export const API_URL = import.meta.env.VITE_API_URL;
export const fetcher = async (url: string) => fetch(API_URL + url).then((res) => res.json());