const Joi = require("joi");
const mongoose = require("mongoose");
const { handlers } = require("../utilities/handlers/handlers");

const MIN_HOURS_AHEAD = process.env.EVENT_MIN_HOURS_AHEAD
  ? parseInt(process.env.EVENT_MIN_HOURS_AHEAD, 10)
  : 48; // Default to 48 hours

const validateObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

// Calculate the minimum allowed event date
const now = new Date();
const minEventDate = new Date(now.getTime() + MIN_HOURS_AHEAD * 60 * 60 * 1000);

exports.validateCreateEvent = (req, res, next) => {
  const schema = Joi.object({
    photo: Joi.string().custom(validateObjectId).optional(),
    blur_hash: Joi.string().optional(),
    type: Joi.string().valid("public", "private").required(),
    title: Joi.string().required(),
    fee: Joi.number().min(0).optional(),
    date: Joi.date().greater(minEventDate).required(),
    duration: Joi.number().min(1).required(),
    location: Joi.object({
      name: Joi.string().required(),
      type: Joi.string().required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required()
    }).required(),
    link: Joi.string().uri().optional(),
    description: Joi.string().optional(),
    are_comments_enabled: Joi.boolean().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    handlers.logger.failed({ message: error.details[0].message });
    return handlers.response.failed({ res, message: error.details[0].message });
  }
  next();
};

exports.validateUpdateEvent = (req, res, next) => {
  const schema = Joi.object({
    photo: Joi.string().custom(validateObjectId).optional(),
    blur_hash: Joi.string().custom(validateBlurHash).optional(),
    type: Joi.string().valid("public", "private").optional(),
    title: Joi.string().optional(),
    fee: Joi.number().min(0).optional(),
    date: Joi.date().greater(minEventDate).optional(),
    duration: Joi.number().min(1).optional(),
    location: Joi.object({
      name: Joi.string().optional(),
      type: Joi.string().optional(),
      coordinates: Joi.array().items(Joi.number()).length(2).optional()
    }).optional(),
    link: Joi.string().uri().optional(),
    description: Joi.string().optional(),
    are_comments_enabled: Joi.boolean().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    handlers.logger.failed({ message: error.details[0].message });
    return handlers.response.failed({ res, message: error.details[0].message });
  }
  next();
};

exports.validateEventIdParam = (req, res, next) => {
  if (
    !req.params.event_id ||
    !mongoose.Types.ObjectId.isValid(req.params.event_id)
  ) {
    handlers.logger.failed({ message: "Invalid Event ID" });
    return handlers.response.failed({ res, message: "Invalid Event ID" });
  }
  next();
};
