using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;


namespace Prosares.Wow.Data.Services.Crypto
{
    public class CryptoService : ICryptoService
    {
        #region Fields
        private IConfiguration _configuration;
        private int iterations = 100;
        private string key = "ENapaxaWvMMiaBKk";
        #endregion

        #region Constructor
        public CryptoService(IConfiguration configuration)
        {
            _configuration = configuration;
            iterations = Convert.ToInt32(_configuration.GetSection("Crypto:iterations"));
            key = Convert.ToString(_configuration.GetSection("Crypto:key"));
            
        }
        #endregion

        #region Methods
        public string Encrypt(string input, string password = "")
        {
            byte[] encrypted;
            byte[] IV;
            byte[] Salt = GetSalt();
            byte[] Key = CreateKey(password == string.Empty ? key : password, Salt);

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Key;
                aesAlg.Padding = PaddingMode.PKCS7;
                aesAlg.Mode = CipherMode.CBC;

                aesAlg.GenerateIV();
                IV = aesAlg.IV;

                var encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                using (var msEncrypt = new MemoryStream())
                {
                    using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (var swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(input);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }

            byte[] combinedIvSaltCt = new byte[Salt.Length + IV.Length + encrypted.Length];
            Array.Copy(Salt, 0, combinedIvSaltCt, 0, Salt.Length);
            Array.Copy(IV, 0, combinedIvSaltCt, Salt.Length, IV.Length);
            Array.Copy(encrypted, 0, combinedIvSaltCt, Salt.Length + IV.Length, encrypted.Length);

            return Convert.ToBase64String(combinedIvSaltCt.ToArray());
        }

        public string Decrypt(string input, string password = "")
        {
            byte[] inputAsByteArray;
            string plaintext = null;
            try
            {
                inputAsByteArray = Convert.FromBase64String(input);

                byte[] Salt = new byte[32];
                byte[] IV = new byte[16];
                byte[] Encoded = new byte[inputAsByteArray.Length - Salt.Length - IV.Length];

                Array.Copy(inputAsByteArray, 0, Salt, 0, Salt.Length);
                Array.Copy(inputAsByteArray, Salt.Length, IV, 0, IV.Length);
                Array.Copy(inputAsByteArray, Salt.Length + IV.Length, Encoded, 0, Encoded.Length);

                byte[] Key = CreateKey(password == string.Empty ? key : password, Salt);

                using (Aes aesAlg = Aes.Create())
                {
                    aesAlg.Key = Key;
                    aesAlg.IV = IV;
                    aesAlg.Mode = CipherMode.CBC;
                    aesAlg.Padding = PaddingMode.PKCS7;

                    ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                    using (var msDecrypt = new MemoryStream(Encoded))
                    {
                        using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        {
                            using (var srDecrypt = new StreamReader(csDecrypt))
                            {
                                plaintext = srDecrypt.ReadToEnd();
                            }
                        }
                    }
                }

                return plaintext;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public byte[] CreateKey(string password, byte[] salt)
        {
            using (var rfc2898DeriveBytes = new Rfc2898DeriveBytes(password, salt, iterations))
                return rfc2898DeriveBytes.GetBytes(32);
        }

        private byte[] GetSalt()
        {
            var salt = new byte[32];
            using (var random = new RNGCryptoServiceProvider())
            {
                random.GetNonZeroBytes(salt);
            }

            return salt;
        }

        public string GetHash(string msg, string salt = "")
        {
            string hashString = string.Empty;
            byte[] result = CreateKey(msg, Encoding.UTF8.GetBytes(salt == string.Empty ? key : salt));

            foreach (byte x in result)
            {
                hashString += String.Format("{0:x2}", x);
            }

            return hashString;
        }
        #endregion
    }
}
