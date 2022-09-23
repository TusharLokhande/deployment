using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.Crypto
{
    public interface ICryptoService
    {
        /// <summary>
        /// Encrypt string using AES
        /// </summary>
        /// <param name="input"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        string Encrypt(string input, string password = "");

        /// <summary>
        /// Decrypt string using AES
        /// </summary>
        /// <param name="input"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        string Decrypt(string input, string password = "");

        /// <summary>
        /// Create Key in byte[] using password
        /// </summary>
        /// <param name="password"></param>
        /// <param name="salt"></param>
        /// <returns></returns>
        byte[] CreateKey(string password, byte[] salt);

        /// <summary>
        /// Create message hash
        /// </summary>
        /// <param name="msg"></param>
        /// <param name="salt"></param>
        /// <returns></returns>
        string GetHash(string msg, string salt = "");
    }
}
