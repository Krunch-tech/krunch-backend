import bcrypt from 'bcrypt'

const hashPassword = async (pass: string) => {
  const salt: string = process.env.HASH_SALT!;
  const hash = await bcrypt.hash(pass, salt);
  return hash;
}

export default hashPassword;
