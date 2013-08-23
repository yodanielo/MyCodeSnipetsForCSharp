using Comex.Web.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Script.Serialization;
using System.Xml;
using System.Threading.Tasks;
using AutoMapper;
using System.Runtime.Serialization.Json;
using System.IO;
/*
	ProcesosAsincronos procesosAsincronos = new ProcesosAsincronos();
	int index1 = procesosAsincronos.Add(accion1(misparametros));
	int index2 = procesosAsincronos.Add(accion2(misparametros));

	procesosAsincronos.Execute();

	resultado1 = procesosAsincronos.GetResult<tipo1>(index1);
	resultado2 = procesosAsincronos.GetResult<tipo2>(index2);
*/
namespace Helpers
{
    public class ProcesosAsincronos
    {
        List<Task> lstTask;

        public ProcesosAsincronos()
        {
            lstTask = new List<Task>();
        }
        /// <summary>
        /// Agrega un nuevo método para ser ejecutado asincronamente
        /// Nota: El método no debe ejecutar en su proceso una sesión.
        /// </summary>
        /// <typeparam name="T">Tipo de dato</typeparam>
        /// <param name="lst"></param>
        /// <returns>Indice del proceso a ajecutarse</returns>
        public int Add<T>(List<T> lst)
        {
            int index = -1;
            Task<List<T>> lstTaskList = Task<List<T>>.Factory.StartNew(() => lst);

            lstTask.Add(lstTaskList);
            index = lstTask.Count - 1;
            return index;
        }

        public void Execute()
        {
            Task.WaitAll(lstTask.ToArray());
        }

        public List<T> GetResult<T>(int index)
        {
            Task<List<T>> rspt = (Task<List<T>>)lstTask[index];
            return rspt.Result;
        }
    }
}