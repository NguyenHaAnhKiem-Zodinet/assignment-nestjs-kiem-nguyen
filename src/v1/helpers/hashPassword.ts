import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const passwordHash: string = await bcrypt.hashSync(
      password,
      Number(process.env.ROUNDS),
    );

    return passwordHash;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
