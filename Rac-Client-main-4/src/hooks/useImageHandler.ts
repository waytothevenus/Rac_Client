import { useState, type ChangeEvent } from "react";

export type DraftImageType = {
  name: string;
  base64: string;
};

const useImageHandler = (initialImage: DraftImageType) => {
  const [image, setImage] = useState<DraftImageType>(initialImage);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImage(initialImage);
    const files = e.target.files;
    if (!(files instanceof FileList) || !(files[0] instanceof Blob)) return;

    const name = files[0].name;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      const base64String = base64Data?.toString() ?? initialImage.base64;
      setImage({ name, base64: base64String });
    };
    reader.readAsDataURL(files[0]);
  };

  return { image, handleImageChange };
};

export default useImageHandler;
