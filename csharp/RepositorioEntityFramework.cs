namespace Helpers
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Objects;
    using System.Data.Objects.DataClasses;
    using System.Linq;

    public class RepositorioEntityFramework<TData>
        where TData: class
    {
        protected DbContext Contexto;
        protected DbSet<TData> DbSet;

        protected RepositorioEntityFramework(DbContext contexto)
        {
            Contexto = contexto;
            DbSet = contexto.Set<TData>();
        }

        public virtual TData ObtenerPorId(object id)
        {
            return DbSet.Find(id);
        }

        public virtual void Agregar(TData entidad)
        {
            DbSet.Add(entidad);
        }

        public virtual void Eliminar(TData entidad)
        {
            if (Contexto.Entry(entidad).State == EntityState.Detached)
            {
                DbSet.Attach(entidad);
            }
            DbSet.Remove(entidad);
        }
        public virtual void EliminarLogicamente(TData entidad)
        {
            Actualizar(entidad);
            var entry = Contexto.Entry(entidad);
            foreach (var name in entry.CurrentValues.PropertyNames)
            {
                try
                {
                    if (name == "EstadoRegistro")
                        entry.Property(name).IsModified = true;
                    else
                        entry.Property(name).IsModified = false;
                }
                catch { }
            }
            Contexto.Entry(entidad).Property("FechaHoraActualizacion").CurrentValue = DateTime.Now;
            Contexto.Entry(entidad).Property("EstadoRegistro").CurrentValue = false;
        }
        public virtual void Actualizar(TData entidad)
        {
            if (Contexto.Entry(entidad).State == EntityState.Detached)
            {
                DbSet.Attach(entidad);
                //((IObjectContextAdapter)Contexto).ObjectContext.ObjectStateManager.ChangeObjectState(entidad, EntityState.Modified);
            }
            Contexto.Entry(entidad).State = EntityState.Modified;
        }
        public virtual void Actualizar(TData entidad, bool omitirdatoscreacion, List<String> lstomitirdatos)
        {
            Actualizar(entidad);
            if (omitirdatoscreacion)
            {
                Contexto.Entry(entidad).Property("FechaHoraCreacion").IsModified = false;
                Contexto.Entry(entidad).Property("UsuarioCreacion").IsModified = false;
            }
            if (lstomitirdatos.Count > 0)
            {
                foreach (String reg in lstomitirdatos)
                {
                    Contexto.Entry(entidad).Property(reg).IsModified = false;
                }
            }
        }
        public virtual void Actualizar(TData entidad, bool omitirdatoscreacion)
        {
            Actualizar(entidad);
            if (omitirdatoscreacion)
            {
                Contexto.Entry(entidad).Property("FechaHoraCreacion").IsModified = false;
                Contexto.Entry(entidad).Property("UsuarioCreacion").IsModified = false;
            }
        }
        public virtual void Actualizar(TData entidad, List<String> lstomitirdatos)
        {
            Actualizar(entidad);
            if (lstomitirdatos.Count>0)
            {
                foreach (String reg in lstomitirdatos)
                {
                    Contexto.Entry(entidad).Property(reg).IsModified = false;
                }
            }
        }


        public virtual void Grabar()
        {
            Contexto.SaveChanges();
        }

        public void ReAttach(TData entidad)
        {
            if (Contexto.Entry(entidad).State == EntityState.Detached)
            {
                DbSet.Attach(entidad);
            }
        }
    }
}