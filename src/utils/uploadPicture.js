import { cloudinaryConfig } from "../Config/cloudinaryConfig.js";


export const uploadPicture = async (file, folder) => {
  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    file.path,
    {
      folder: `${process.env.CLOUD_FOLDER}/${folder}`,
      resource_type: "image",
    }
  );

  return { secure_url, public_id };
}

export const uploadPictures = async (files, folder) => {
  const Images = [];
  for (const file of files) {
    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
      file.path,
      {
        folder: `${process.env.CLOUD_FOLDER}/${folder}`,
        resource_type: "image",
      }
    );
    Images.push({ secure_url, public_id });
  }

  return Images;
}