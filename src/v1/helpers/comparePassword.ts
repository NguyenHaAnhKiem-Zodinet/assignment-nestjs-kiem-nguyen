import * as bcrypt from 'bcrypt';

export const comparePassword = async (
  password: string,
  passwordCheck: string,
): Promise<boolean> => {
  try {
    const isCheckPassword = await bcrypt.compareSync(password, passwordCheck);

    return isCheckPassword;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
