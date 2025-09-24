import z from 'zod';

const userRegisterValidationSchema = z.object({
  body: z.object({
    name: z.string().max(20).trim(),
    email: z.email(),
    password: z.string().max(20),
  }),
});

const userLoginValidationSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().max(20),
  }),
});

export const userValidationSchema = {
  userRegisterValidationSchema,
  userLoginValidationSchema,
};
