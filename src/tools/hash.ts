import bcrypt from 'bcrypt'

async function hashPassword(pass: string) {
  const salt: string = process.env.HASH_SALT!;
  const hash = await bcrypt.hash(pass, salt);
  return hash;
}

module.exports.hashPassword = hashPassword;