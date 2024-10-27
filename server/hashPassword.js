const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const connection1 = mongoose.createConnection(process.env.MONGO_DB1, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection1.on('connected', async () => {
  console.log('Connected to first database');

  const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
  });

  const UserModel = connection1.model('Admin', UserSchema, 'admin');

  // Hash the password
  const saltRounds = 10;
  const plainPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  // Update the user password to the hashed version
  await UserModel.updateOne(
    { username: 'admin' },
    { $set: { password: hashedPassword } }
  );

  console.log('Password updated to hashed version');
  process.exit();
});
