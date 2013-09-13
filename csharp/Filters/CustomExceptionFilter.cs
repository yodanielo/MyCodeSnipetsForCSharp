using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Web.Filters
{
    public class CustomExceptionFilter : FilterAttribute, IExceptionFilter
    {
        public void OnException(ExceptionContext filterContext)
        {          

                if (filterContext.ExceptionHandled) return;

                //TODO: Grabar en Log
                ManejadorLog manejadorLog = new ManejadorLog();

                manejadorLog.GrabarLog(filterContext.Exception.Message + " - " + filterContext.Exception.StackTrace);
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Error", action = "Error" }));
                filterContext.ExceptionHandled = true;
                filterContext.HttpContext.Response.Clear();
                filterContext.HttpContext.Response.StatusCode = 500;
                filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;
            
        }
    }
}