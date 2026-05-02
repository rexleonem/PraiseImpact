import { v2 as cloudinary } from 'cloudinary';
export declare const getSignedUploadSignature: () => {
    timestamp: number;
    signature: string;
};
export default cloudinary;
