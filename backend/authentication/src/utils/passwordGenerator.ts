import { v4 as uuidv4 } from 'uuid';

// Function to generate a temporary password with mixed characters (uppercase, lowercase, number, symbol)
function generateTemporaryPassword() {
  // Helper function to generate random characters
  const randomUpperCase = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65); // A-Z
  const randomLowerCase = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
  const randomNumber = () => Math.floor(Math.random() * 10); // 0-9
  const randomSymbol = () => {
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?/';
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  // Generate each part of the password
  const uppercase = randomUpperCase();
  const lowercase = randomLowerCase();
  const number = randomNumber();
  const symbol = randomSymbol();

  // Generate the remaining characters from uuid and ensure the length is 12
  const uuidPart = uuidv4().replace(/-/g, '').slice(0, 8); // Take first 8 characters from uuid

  // Shuffle and combine all parts (to avoid predictable patterns)
  const password = (uppercase + lowercase + number + symbol + uuidPart)
    .split('')
    .sort(() => 0.5 - Math.random()) // Shuffle the characters
    .join('')
    .slice(0, 12); // Ensure the final password is 12 characters long

  return password;
}


export default generateTemporaryPassword;
