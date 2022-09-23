using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Prosares.Wow.Data.DBContext;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Repository
{
    public partial class BaseRepository<TEntity> : IRepository<TEntity> where TEntity : BaseEntity
    {
        private SqlConnection _connection;
        SqlDbContext _context;
        private DbSet<TEntity> entities;
        DbSet<TEntity> IRepository<TEntity>.Table => entities;
       

        public BaseRepository(SqlDbContext context, IOptions<ConnectionString> connectionStrings)// IOptions<ConnectionStrings> connectionStrings
        {
            string dataSource = connectionStrings.Value.DataSource;
            string database = connectionStrings.Value.Database;
            string userName = connectionStrings.Value.UserName;
            string password = connectionStrings.Value.Password;
            string connectionString = $"server={dataSource};database={database};user={userName};password={password};"/* $"server={dataSource};port=3306;database={database};user={userName};password={password};"*/;
            _connection = new SqlConnection(connectionString);
            this._context = context;
            entities = context.Set<TEntity>();
        }
        public IEnumerable<TEntity> GetAll()
        {
            return entities.AsEnumerable();
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _context.Set<TEntity>().ToListAsync();
        }

        /// <summary>
        /// Get List of data using linq query from underlaing table
        /// </summary>
        /// <param name="func">LINQ Function to select entries</param>
        /// <returns>List of records</returns>
        public virtual IList<TEntity> Get(Func<DbSet<TEntity>, IQueryable<TEntity>> func = null)
        {
            var query = func != null ? func(entities) : entities;

            return query.ToList();
        }

        /// <summary>
        /// Get data by ID
        /// </summary>
        /// <param name="id">Underlayig table ID column</param>
        /// <returns>Single record by Id</returns>
        public TEntity GetById(long id)
        {
            return entities.SingleOrDefault(s => s.Id == id);
        }

        /// <summary>
        /// Insert a single row in underlaying table 
        /// </summary>
        /// <param name="entity"> Record entity</param>
        public void Insert(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            entities.Add(entity);
            _context.SaveChanges();
        }

        public void UpdateAsNoTracking(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }


            _context.ChangeTracker.Clear();
            _context.Update(entity);
            _context.SaveChanges();
        }

        /// <summary>
        /// Insert and getback a single row in underlaying table 
        /// </summary>
        /// <param name="entity">Record entity</param>
        /// <returns>After Inster record from table </returns>
        public TEntity InsertAndGet(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            entities.Add(entity);
            _context.SaveChanges();

            return entity;
        }

        public void Update(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }



            _context.Update(entity);
            _context.SaveChanges();
        }

        public void Delete(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            entities.Remove(entity);
            _context.SaveChanges();
        }
        public void Remove(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            entities.Remove(entity);
        }

        public bool IsExist(long id)
        {
            return entities.Any(i => i.Id == id);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        public IEnumerable<TEntity> GetAll(Func<DbSet<TEntity>, IQueryable<TEntity>> func = null)
        {
            var query = func != null ? func(entities) : entities;

            return query.ToList();
        }

        /// <summary>
        /// map result set to Entity
        /// </summary>
        /// <param name="reader"></param>
        /// <param name="propertyKeyMap"></param>
        /// <returns></returns>
        public virtual TEntity PopulateRecord(SqlDataReader reader, IDictionary<string, string> propertyKeyMap = null)
        {
            if (reader != null)
            {
                var entity = GetInstance<TEntity>();
                if (propertyKeyMap == null)
                {
                    foreach (var prop in entity.GetType().GetProperties())
                    {
                        if (HasColumn(reader, prop.Name))
                        {
                            if (reader[prop.Name] != DBNull.Value)
                            {
                                if (prop != null)
                                {
                                    Type t = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;

                                    object safeValue = (reader[prop.Name] == null) ? null : Convert.ChangeType(reader[prop.Name], t);

                                    prop.SetValue(entity, safeValue, null);
                                }

                                //Type propType = prop.PropertyType;
                                //prop.SetValue(entity, Convert.ChangeType(reader[prop.Name], propType), null);
                            }
                        }
                    }
                    return entity;
                }
                else
                {
                    foreach (var propkey in propertyKeyMap)
                    {
                        var prop = entity.GetType().GetProperties().Where(m => m.Name.ToLower() == propkey.Key.ToLower()).FirstOrDefault();
                        if (HasColumn(reader, propkey.Value) && prop != null)
                        {
                            if (reader[propkey.Value] != DBNull.Value)
                            {
                                if (prop != null)
                                {
                                    Type t = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;

                                    object safeValue = (reader[prop.Name] == null) ? null : Convert.ChangeType(reader[prop.Name], t);

                                    prop.SetValue(entity, safeValue, null);
                                }

                                //Type propType = prop.PropertyType;
                                //prop.SetValue(entity, Convert.ChangeType(reader[propkey.Value], propType), null);
                            }
                        }
                    }
                    return entity;
                }
            }
            return GetInstance<TEntity>();
        }

        /// <summary>
        /// Get the istance of the entity.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        protected To GetInstance<To>()
        {
            return (To)FormatterServices.GetUninitializedObject(typeof(TEntity));
        }

        /// <summary>
        /// Check if the coloum exsist in the Datareader
        /// </summary>
        /// <param name="dr"></param>
        /// <param name="columnName"></param>
        /// <returns></returns>
        protected bool HasColumn(IDataRecord dr, string columnName)
        {
            for (int i = 0; i < dr.FieldCount; i++)
            {
                if (dr.GetName(i).Equals(columnName, StringComparison.InvariantCultureIgnoreCase))
                    return true;
            }
            return false;
        }

        /// <summary>
        /// get array of records for a entity
        /// </summary>
        /// <param name="command">Sql Command with parameters or query.</param>
        /// <returns></returns>
        public IEnumerable<TEntity> GetRecords(SqlCommand command)
        {
            var list = new List<TEntity>();
            command.Connection = _connection;
            if (_connection.State == ConnectionState.Closed)
                _connection.Open();
            try
            {
                var reader = command.ExecuteReader();
                try
                {
                    while (reader.Read())
                        list.Add(PopulateRecord(reader));
                }
                finally
                {
                    // Always call Close when done reading.
                    reader.Close();
                }
            }
            finally
            {
                _connection.Close();
            }
            return list;
        }

        /// <summary>
        /// get record for a entity
        /// </summary>
        /// <param name="command">Sql Command with parameters or query.</param>
        /// <returns></returns>
        public TEntity GetRecord(SqlCommand command)
        {
            TEntity record = null;
            command.Connection = _connection;
            if (_connection.State == ConnectionState.Closed)
                _connection.Open();
            try
            {
                var reader = command.ExecuteReader();
                try
                {
                    while (reader.Read())
                    {
                        record = PopulateRecord(reader);
                        break;
                    }
                }
                finally
                {
                    // Always call Close when done reading.
                    reader.Close();
                }
            }
            finally
            {
                _connection.Close();
            }
            return record;
        }

        /// <summary>
        /// get array of records for a entity
        /// </summary>
        /// <param name="command">Sql Command with parameters or query.</param>
        /// <param name="propertyMap">Maping of Class property to reader coloum.</param>
        /// <returns></returns>
        public IEnumerable<TEntity> GetRecords(SqlCommand command, IDictionary<string, string> propertyMap)
        {
            var list = new List<TEntity>();
            command.Connection = _connection;
            if (_connection.State == ConnectionState.Closed)
                _connection.Open();
            try
            {
                var reader = command.ExecuteReader();
                try
                {
                    while (reader.Read())
                        list.Add(PopulateRecord(reader, propertyMap));
                }
                finally
                {
                    // Always call Close when done reading.
                    reader.Close();
                }
            }
            finally
            {
                _connection.Close();
            }
            return list;
        }

        /// <summary>
        /// get record for a entity
        /// </summary>
        /// <param name="command">Sql Command with parameters or query.</param>
        /// <param name="propertyMap">Maping of Class property to reader coloum.</param>
        /// <returns></returns>
        public TEntity GetRecord(SqlCommand command, IDictionary<string, string> propertyMap)
        {
            TEntity record = null;
            command.Connection = _connection;
            if (_connection.State == ConnectionState.Closed)
                _connection.Open();

            try
            {
                var reader = command.ExecuteReader();
                try
                {
                    while (reader.Read())
                    {
                        record = PopulateRecord(reader, propertyMap);
                        break;
                    }
                }
                finally
                {
                    // Always call Close when done reading.
                    reader.Close();
                }
            }
            finally
            {
                _connection.Close();
            }
            return record;
        }
    }

    public class ConnectionString
    {
        public string Database { get; set; }
        public string DataSource { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ProviderName { get; set; }

    }

}
