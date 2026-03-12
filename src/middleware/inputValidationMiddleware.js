import Joi from 'joi';

 const registerSChema = Joi.object({
    name:Joi.string().min(3).max(30).required(),
    email:Joi.string().email().required(),
     password: Joi.string()
         .min(6)
         .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?]).+$"))
        .required()
         .messages({
             "string.pattern.base": "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
             "string.min": "Password must be at least 6 characters long",
             "any.required": "Password is required"
         }),
    role:Joi.forbidden()
        })
 const loginSchema = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required()
 })
 const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(200).required(),

  description: Joi.string().min(10).required(),

  price: Joi.number().min(0).required(),

  discountPrice: Joi.number().min(0).default(0),

  stock: Joi.number().min(0).required(),

  category: Joi.string()
   .pattern(/^[0-9a-fA-F]{24}$/)
   .message("Category must be a valid MongoDB ObjectId")

    .required()
});export {registerSChema, loginSchema, createProductSchema};




export const validateRequest = (sche) => (req, res, next) => {

    const { error, value } = sche.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ message: "Validation Error", errors: errorMessages });
    }
    req.body = value;
    next();
}