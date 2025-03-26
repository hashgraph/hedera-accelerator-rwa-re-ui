import { pinata } from "@/utils/pinata";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

export const useUploadImageToIpfs = () => {
   const { mutateAsync, isPending } = useMutation({
      mutationKey: ["UPLOAD_IMAGE_TO_IPFS"],
      mutationFn: uploadImageToIpfs,
   });

   async function uploadImageToIpfs(fileToUpload: File) {
      const keyImageRequest = await fetch("/api/pinataKey");
      const keyImageData = await keyImageRequest.json();
      const { IpfsHash } = await pinata.upload
         .file(fileToUpload, {
            metadata: { name: `image-${fileToUpload.name}` },
         })
         .key(keyImageData.JWT);

      return IpfsHash;
   }

   return {
      uploadImage: mutateAsync,
      isPending,
   };
};
