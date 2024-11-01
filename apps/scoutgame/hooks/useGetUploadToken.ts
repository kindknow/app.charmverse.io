import { useGETtrigger } from './api/helpers';

export function useGetUploadToken() {
  return useGETtrigger<
    { filename: string },
    {
      token: any;
      region: string;
      bucket: string;
      key: string;
    }
  >('/api/aws/upload-token');
}