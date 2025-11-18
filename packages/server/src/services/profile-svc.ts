import { Schema, model } from "mongoose";
import { Profile } from "../models/profile";

const ProfileSchema = new Schema<Profile>(
  {
    userid: { type: String, required: true, trim: true },
    favoriteCards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
    avatar: String,
  },
  { collection: "lum-profiles" }
);

const ProfileModel = model<Profile>("Profile", ProfileSchema);


function index(): Promise<Profile[]> {
  return ProfileModel.find();
}

function get(userid: String): Promise<Profile> {
  return ProfileModel.find({ userid })
    .then((list) => list[0])
    .catch(() => {
      throw `${userid} Not Found`;
    });
}

function getFavorites(userid: string) {
  return ProfileModel.findOne({ userid })
    .populate("favoriteCards")
    .then((found) => {
      if (!found) throw `${userid} Not Found`;
      return found?.favoriteCards || [];
    });
}


function update(
  userid: String,
  profile: Profile
): Promise<Profile> {
  return ProfileModel.findOne({ userid })
    .then((found) => {
      if (!found) throw `${userid} Not Found`;
      else
        return ProfileModel.findByIdAndUpdate(
          found._id,
          profile,
          {
            new: true
          }
        );
    })
    .then((updated) => {
      if (!updated) throw `${userid} not updated`;
      else return updated as Profile;
    });
}

function addFavorite(userid: string, cardId: string): Promise<Profile> {
  return ProfileModel.findOne({ userid })
    .then((found) => {
      if (!found) throw `${userid} Not Found`;
      if (!found.favoriteCards.includes(cardId as any)) {
        found.favoriteCards.push(cardId as any);
        return found.save();
      }
      return found;
    });
}

function removeFavorite(userid: string, cardId: string): Promise<Profile> {
  return ProfileModel.findOne({ userid })
    .then((found) => {
      if (!found) throw `${userid} Not Found`;
      found.favoriteCards = found.favoriteCards.filter(
        (id) => id.toString() !== cardId
      );
      return found.save();
    });
}

export default { index, get, getFavorites, update, addFavorite, removeFavorite };