using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Repository
{
    public interface IRepository<TEntity> where TEntity : BaseEntity
    {
        DbSet<TEntity> Table { get; }
        IEnumerable<TEntity> GetAll();
        IEnumerable<TEntity> GetAll(Func<DbSet<TEntity>, IQueryable<TEntity>> func = null);
        Task<IEnumerable<TEntity>> GetAllAsync();
        IList<TEntity> Get(Func<DbSet<TEntity>, IQueryable<TEntity>> func = null);
        TEntity GetById(long id);
        void Insert(TEntity entity);
        TEntity InsertAndGet(TEntity entity);
        void Update(TEntity entity);
        void Delete(TEntity entity);
        void Remove(TEntity entity);
        bool IsExist(long id);
        void SaveChanges();

        void UpdateAsNoTracking(TEntity entity);

        /// <summary>
        /// get array of records for a entity
        /// </summary>
        /// <param name="command">Sql Command with parameters or query.</param>
        /// <returns></returns>
        IEnumerable<TEntity> GetRecords(SqlCommand command);


        /// <summary>
        /// get record for a entity
        /// </summary>
        /// <param name="command">Sql Command with parameters or query.</param>
        /// <returns></returns>
        TEntity GetRecord(SqlCommand command);


        /// <summary>
        /// get array of records for a entity
        /// </summary>
        /// <param name="command">Sql Command with parameters or query.</param>
        /// <param name="propertyMap">Maping of Class property to reader coloum.</param>
        /// <returns></returns>
        IEnumerable<TEntity> GetRecords(SqlCommand command, IDictionary<string, string> propertyMap);

        /// <summary>
        /// get record for a entity
        /// </summary>
        /// <param name="command">Sql Command with parameters or query.</param>
        /// <param name="propertyMap">Maping of Class property to reader coloum.</param>
        /// <returns></returns>
        TEntity GetRecord(SqlCommand command, IDictionary<string, string> propertyMap);
    }
}
