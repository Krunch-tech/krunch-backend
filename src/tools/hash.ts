import bcrypt from 'bcrypt'

const hashPassword = async (pass: string) => {
  let salt: string = process.env.HASH_SALT!;
  const saltNum: number = parseInt(salt); 
  const hash = await bcrypt.hash(pass, saltNum);
  return hash;
}

export default hashPassword;
