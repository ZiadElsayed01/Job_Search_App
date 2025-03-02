import { User } from "../../../DB/Models/userModel.js";

export const uploadProfileImage = async(req, res) => {
  const { file } = req;
  const { _id } = req.loggedInUser;

  if (!file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

    const imageURL = `${req.protocol}://${req.headers.host}/${file.path.replace(
      /\\/g,
      "/"
    )}`.replace(/ /g, "%20");

    const user = await User.findByIdAndUpdate(
      _id,
      { profilePicture: imageURL },
      { new: true }
    );

    res.status(200).json({ message: "Image uploaded successfully", user });
}

export const uploadCoverImage = async (req, res) => {
  const { files } = req;
  const { _id } = req.loggedInUser;

  if (!files?.length) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const coverImagesURL = files.map((file) => {
    return `${req.protocol}://${req.headers.host}/${file.path.replace(
      /\\/g,
      "/"
    )}`.replace(/ /g, "%20");
  });

  const user = await User.findByIdAndUpdate(
    _id,
    { coverPicture: coverImagesURL },
    { new: true }
  );

  res.status(200).json({ message: "Image uploaded successfully", user });
}