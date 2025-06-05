const { Schema, model } = require("mongoose");
const bcryptjs = require("bcryptjs");

const saltRounds = process.env.SALT_ROUNDS;

const userSchema = new Schema(
  {
    firstName: { type: String, trim: true, default: null },
    lastName: { type: String, trim: true, default: null },
    age: { type: String, trim: true, default: null },
    about: { type: String, trim: true, default: null },
    location: {
      name: { type: String, default: null },
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0], index: "2dsphere" }
    },
    emailAddress: { type: String, trim: true, default: null },
    phoneNumber: { type: String, trim: true, default: null },
    socialToken: { type: String, trim: true, default: null },
    deviceToken: { type: String, trim: true, default: null },
    sessionToken: { type: String, trim: true, default: null },
    password: { type: String, trim: true, default: null },
    provider: {
      type: String,
      enum: ["google", "apple", "phone", "email"],
      trim: true,
      default: "email"
    },
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    role: {
      type: String,
      enum: ["admin", "user"],
      trim: true,
      default: "user"
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    isNotificationEnabled: { type: Boolean, default: false },
    isProfileCompleted: { type: Boolean, default: false },
    isSelfieVerified: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: false },
    isSosActivated: { type: Boolean, default: false },
    isAnonymousProfile: { type: Boolean, default: false },
    isSwipeRight: { type: Boolean, default: false },
    isSuperLiked: { type: Boolean, default: false },
    isSwipeLeft: { type: Boolean, default: false },
    receiptToken: { type: String, default: null },
    profilePicture: { type: String, trim: true, default: null },
    avatar: { type: String, trim: true, default: null },
    liveSelfie: { type: String, trim: true, default: null },
    identityDocument: { type: String, trim: true, default: null },
    trainingCertificates: [{ type: String, trim: true, default: null }],
    availableTime: {
      monday: {
        from: { type: String, default: null },
        to: { type: String, default: null }
      },
      tuesday: {
        from: { type: String, default: null },
        to: { type: String, default: null }
      },
      wednesday: {
        from: { type: String, default: null },
        to: { type: String, default: null }
      },
      thursday: {
        from: { type: String, default: null },
        to: { type: String, default: null }
      },
      friday: {
        from: { type: String, default: null },
        to: { type: String, default: null }
      },
      saturday: {
        from: { type: String, default: null },
        to: { type: String, default: null }
      },
      sunday: {
        from: { type: String, default: null },
        to: { type: String, default: null }
      }
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      trim: true,
      default: null
    },
    relationship: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
      trim: true,
      default: null
    },
    feelings: {
      type: String,
      enum: ["happy", "angry", "calm", "sad"],
      trim: true,
      default: null
    },
    gallery: [
      {
        type: { type: String, enum: ["image", "video"], required: true },
        url: { type: String, required: true, trim: true },
        thumbnail: { type: String, trim: true, default: null }
      }
    ],
    interests: [{ type: String, default: null }],
    hobbies: [{ type: String, default: null }],
    professions: [{ type: String, default: null }],
    emergencyContactNumber: { type: String, default: null },
    pin: { type: Number, default: 12345 },
    myTotalStories: { type: Number, default: 0 },
    myTotalReels: { type: Number, default: 0 },
    myTotalComments: { type: Number, default: 0 },
    myTotalLikes: { type: Number, default: 0 },
    myTotalFavourites: { type: Number, default: 0 },
    totalProfilesVisitedMe: { type: Number, default: 0 },
    totalProfilesIPassed: { type: Number, default: 0 },
    totalProfilesILiked: { type: Number, default: 0 },

    totalBlockedUsers: { type: Number, default: 0 },
    totalReportedUsers: { type: Number, default: 0 },
    totalHiddenFromUsers: { type: Number, default: 0 },
    totalFriends: { type: Number, default: 0 },

    totalPendingFriendRequests: { type: Number, default: 0 },
    totalAcceptedFriendRequests: { type: Number, default: 0 },
    totalRejectedFriendRequests: { type: Number, default: 0 },

    totalCompliments: { type: Number, default: 0 },

    totalReels: { type: Number, default: 0 },
    totalSavedReels: { type: Number, default: 0 },
    totalLikedReels: { type: Number, default: 0 }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcryptjs.genSalt(Number(saltRounds));
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.socialToken;
    delete ret.deviceToken;
    delete ret.receiptToken;
    delete ret.__v;
    return ret;
  }
});

const User = model("User", userSchema);

module.exports = User;
