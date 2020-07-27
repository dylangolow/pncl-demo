import process from "process";
export const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT || 'pncl-demo';
export const STORAGE_BUCKET_NAME = process.env.GCLOUD_STORAGE_BUCKET ? process.env.GCLOUD_STORAGE_BUCKET : 'pncl-demo.appspot.com';
