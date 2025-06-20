const Chat = require("../../models/Chat");
const Comment = require("../../models/Comment");
const Event = require("../../models/Event");
const File = require("../../models/File");
const Otp = require("../../models/Otp");
const Reply = require("../../models/Reply");
const User = require("../../models/User");
const VisitedUser = require("../../models/VisitedUser");
const userSchema = require("../../schemas/user-schema");
const { timeToISODate } = require("../../utilities/formatters/iso-formatters");
const { handlers } = require("../../utilities/handlers/handlers");
const { comparePassword } = require("../../utilities/handlers/password");

class Service {
  constructor() {
    this.chat = Chat;
    this.comment = Comment;
    this.event = Event;
    this.file = File;
    this.otp = Otp;
    this.reply = Reply;
    this.user = User;
    this.visitedUser = VisitedUser;
  }

  async getMyProfile(req, res) {
    try {
      const { user: currentUser } = req;

      currentUser.populate(userSchema.populate);
      await currentUser.save();

      handlers.logger.success({ message: "Success" });
      return handlers.response.success({
        res,
        message: "Success",
        data: currentUser
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async createProfile(req, res) {
    try {
      const { body, user: currentUser } = req;

      const requiredFields = [
        "profilePicture",
        "firstName",
        "lastName",
        "emailAddress",
        "phoneNumber",
        "location",
        "age",
        "availableTime",
        "about"
      ];
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length) {
        const message = `Missing required fields: ${missingFields.join(", ")}`;
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      const profileData = {
        profilePicture: body.profilePicture,
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
        location: body.location,
        age: body.age,
        availableTime: {
          monday: {
            from: timeToISODate(body.availableTime.monday.from),
            to: timeToISODate(body.availableTime.monday.to)
          },
          tuesday: {
            from: timeToISODate(body.availableTime.tuesday.from),
            to: timeToISODate(body.availableTime.tuesday.to)
          },
          wednesday: {
            from: timeToISODate(body.availableTime.wednesday.from),
            to: timeToISODate(body.availableTime.wednesday.to)
          },
          thursday: {
            from: timeToISODate(body.availableTime.thursday.from),
            to: timeToISODate(body.availableTime.thursday.to)
          },
          friday: {
            from: timeToISODate(body.availableTime.friday.from),
            to: timeToISODate(body.availableTime.friday.to)
          },
          saturday: {
            from: timeToISODate(body.availableTime.saturday.from),
            to: timeToISODate(body.availableTime.saturday.to)
          },
          sunday: {
            from: timeToISODate(body.availableTime.sunday.from),
            to: timeToISODate(body.availableTime.sunday.to)
          }
        },
        about: body.about,
        isProfileCompleted: true
      };

      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, profileData, { new: true })
        .populate(userSchema.populate);

      handlers.logger.success({
        message: "Success",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Success",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async createAvatar(req, res) {
    try {
      const { body, user: currentUser } = req;

      const requiredFields = ["avatar"];
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length) {
        const message = `Missing required fields: ${missingFields.join(", ")}`;
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      const profileData = {
        avatar: body.avatar
      };

      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, profileData, { new: true })
        .populate(userSchema.populate);

      handlers.logger.success({
        message: "Success",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Success",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async setGender(req, res) {
    try {
      const { body, user: currentUser } = req;

      const requiredFields = ["gender"];
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length) {
        const message = `Missing required fields: ${missingFields.join(", ")}`;
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      const profileData = {
        gender: body.gender
      };

      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, profileData, { new: true })
        .populate(userSchema.populate);

      handlers.logger.success({
        message: "Success",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Success",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async setRelationship(req, res) {
    try {
      const { body, user: currentUser } = req;

      const requiredFields = ["relationship"];
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length) {
        const message = `Missing required fields: ${missingFields.join(", ")}`;
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      const profileData = {
        relationship: body.relationship
      };

      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, profileData, { new: true })
        .populate(userSchema.populate);

      handlers.logger.success({
        message: "Success",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Success",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async setFeelings(req, res) {
    try {
      const { body, user: currentUser } = req;

      const requiredFields = ["feelings"];
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length) {
        const message = `Missing required fields: ${missingFields.join(", ")}`;
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      const profileData = {
        feelings: body.feelings
      };

      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, profileData, { new: true })
        .populate(userSchema.populate);

      handlers.logger.success({
        message: "Success",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Success",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async uploadYourPhotosAndVideos(req, res) {
    try {
      const { body, user: currentUser } = req;

      const requiredFields = ["gallery"];
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length) {
        const message = `Missing required fields: ${missingFields.join(", ")}`;
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      // Validate and sanitize each gallery item
      const parsedGallery = Array.isArray(body.gallery)
        ? body.gallery
            .map((item) => {
              if (!item.type || !item.url) return null;

              return {
                type: item.type, // "image" or "video"
                url: item.url.trim(),
                thumbnail:
                  item.type === "video" && item.thumbnail
                    ? item.thumbnail.trim()
                    : null
              };
            })
            .filter(Boolean)
        : [];

      if (!parsedGallery.length) {
        const message =
          "Gallery must include at least one valid image or video object.";
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      const profileData = { gallery: parsedGallery };

      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, profileData, { new: true })
        .populate(userSchema.populate);

      handlers.logger.success({
        message: "Gallery uploaded successfully",
        data: profile
      });

      return handlers.response.success({
        res,
        message: "Gallery uploaded successfully",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async addYourInterests(req, res) {
    try {
      const { body, user: currentUser } = req;

      const requiredFields = ["interests"];
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length) {
        const message = `Missing required fields: ${missingFields.join(", ")}`;
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      const profileData = {
        interests: body.interests
      };

      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, profileData, { new: true })
        .populate(userSchema.populate);

      handlers.logger.success({
        message: "Success",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Success",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async addYourHobbies(req, res) {
    try {
      const { body, user: currentUser } = req;

      const requiredFields = ["hobbies"];
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length) {
        const message = `Missing required fields: ${missingFields.join(", ")}`;
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      const profileData = {
        hobbies: body.hobbies
      };

      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, profileData, { new: true })
        .populate(userSchema.populate);

      handlers.logger.success({
        message: "Success",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Success",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async addYourProfessions(req, res) {
    try {
      const { body, user: currentUser } = req;

      const requiredFields = ["professions"];
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length) {
        const message = `Missing required fields: ${missingFields.join(", ")}`;
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      const profileData = {
        professions: body.professions
      };

      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, profileData, { new: true })
        .populate(userSchema.populate);

      handlers.logger.success({
        message: "Success",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Success",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async uploadCertificates(req, res) {
    try {
      const { body, user: currentUser } = req;

      const requiredFields = ["identityDocument", "trainingCertificates"];
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length) {
        const message = `Missing required fields: ${missingFields.join(", ")}`;
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      const profileData = {
        identityDocument: body.identityDocument,
        trainingCertificates: body.trainingCertificates
      };

      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, profileData, { new: true })
        .populate(userSchema.populate);

      handlers.logger.success({
        message: "Success",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Success",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async setSos(req, res) {
    try {
      const { body, user: currentUser } = req;

      const requiredFields = ["emergencyContactNumber", "pin"];
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length) {
        const message = `Missing required fields: ${missingFields.join(", ")}`;
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      const profileData = {
        emergencyContactNumber: body.emergencyContactNumber,
        pin: body.pin
      };

      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, profileData, { new: true })
        .populate(userSchema.populate);

      handlers.logger.success({
        message: "Success",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Success",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async editProfile(req, res) {
    try {
      const { body, user: currentUser } = req;

      const updateData = {};

      // Check each field and add to updateData if provided in the request body
      if (body.profilePicture) updateData.profilePicture = body.profilePicture;
      if (body.firstName) updateData.firstName = body.firstName;
      if (body.lastName) updateData.lastName = body.lastName;
      if (body.emailAddress) updateData.emailAddress = body.emailAddress;
      if (body.phoneNumber) updateData.phoneNumber = body.phoneNumber;
      if (body.location) updateData.location = body.location;
      if (body.age) updateData.age = body.age;
      if (body.availableTime) updateData.availableTime = body.availableTime;
      if (body.about) updateData.about = body.about;
      if (body.gender) updateData.gender = body.gender;
      if (body.relationship) updateData.relationship = body.relationship;
      if (body.feelings) updateData.feelings = body.feelings;
      if (body.gallery) updateData.gallery = body.gallery;
      if (body.interests) updateData.interests = body.interests;
      if (body.hobbies) updateData.hobbies = body.hobbies;
      if (body.professions) updateData.professions = body.professions;
      if (body.identityDocument)
        updateData.identityDocument = body.identityDocument;
      if (body.trainingCertificates)
        updateData.trainingCertificates = body.trainingCertificates;

      // If no data to update
      if (Object.keys(updateData).length === 0) {
        const message = "No fields provided to update.";
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      // Update the user's profile in the database
      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, updateData, { new: true })
        .populate(userSchema.populate);

      // Log success and send the response
      handlers.logger.success({
        message: "Success",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Success",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async deleteAccount(req, res) {
    try {
      const currenUser = req.user;
      const checkRole = req.user.role;

      if (!req.params.userId) {
        if (checkRole !== "admin") {
          handlers.logger.unauthorized({ message: "Unauthorized" });
          return handlers.response.unauthorized({
            res,
            message: "Unauthorized"
          });
        }
      }

      if (currenUser._id !== req.params.userId) {
        handlers.logger.unauthorized({ message: "Unauthorized" });
        return handlers.response.unauthorized({
          res,
          message: "Unauthorized"
        });
      }

      // Find the user before deletion
      const user = await this.user.findOne(params.userId);
      if (!user) {
        handlers.logger.unavailable({
          message: "User not found or already deleted"
        });

        return handlers.response.unavailable({
          res,
          message: "User not found or already deleted"
        });
      }

      // Delete associated data
      await Promise.all([
        this.user.deleteMany({ _id: user._id }),
        this.comment.deleteMany({ user_id: user._id }),
        this.event.deleteMany({ user_id: user._id }),
        this.file.deleteMany({ user_id: user._id }),
        this.otp.deleteMany({ user_id: user._id }),
        this.reply.deleteMany({ user_id: user._id })
      ]);

      // Delete the user account
      await this.user.findByIdAndDelete(user._id);

      handlers.logger.success({ message: "Success" });

      return handlers.response.success({ res, message: "Success" });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { user: currentUser, body } = req;
      const query = { _id: currentUser._id };
      const { old_password, new_password } = body;

      const user = await this.user.findOne(query);
      if (!user) {
        handlers.logger.unavailable({ message: "User not found" });
        return handlers.response.unavailable({
          res,
          message: "User not found"
        });
      }

      const oldPasswordMatched = await comparePassword({
        plainPassword: old_password,
        hashedPassword: user.password,
        res
      });

      if (!oldPasswordMatched) {
        handlers.logger.failed({ message: "Incorrect old password" });
        return handlers.response.failed({
          res,
          message: "Incorrect old password"
        });
      }

      const newPasswordMatched = await comparePassword({
        plainPassword: new_password,
        hashedPassword: user.password,
        res
      });

      if (newPasswordMatched) {
        handlers.logger.failed({
          message: "New password should be different than current password"
        });
        return handlers.response.failed({
          res,
          message: "New password should be different than current password"
        });
      }

      user.password = new_password;
      await user.save();

      handlers.logger.success({ message: "Password changed successfully" });
      return handlers.response.success({
        res,
        message: "Password changed successfully"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async signOut(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          handlers.logger.error({ message: err });
          return handlers.response.error({
            res,
            message: "Failed to sign out"
          });
        }

        res.clearCookie("authorization", {
          path: "/",
          httpOnly: true,
          sameSite: "lax"
        });

        return handlers.response.success({
          res,
          message: "Sign out successful"
        });
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async visitProfile(req, res) {
    try {
      const user = req.user;
      const { visitedUserId } = req.body;

      const userToVisit = await this.user.findById(visitedUserId);
      if (!userToVisit) {
        return handlers.response.failed({
          res,
          message: "Invalid visited user ID"
        });
      }

      const alreadyVisited = await this.visitedUser.findOne({
        userId: user._id,
        visitedUser: visitedUserId
      });

      if (!alreadyVisited) {
        await this.visitedUser.create({
          userId: user._id,
          visitedUser: userToVisit._id
        });
      }

      userToVisit.totalProfilesVisitedMe++;
      await userToVisit.save();

      return handlers.response.success({ res, message: "Success" });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }
}

module.exports = new Service();
