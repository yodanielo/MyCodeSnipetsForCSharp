using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;//--------------------------->dependency
using Newtonsoft.Json.Converters;//---------------->dependency
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization.Json;
using System.Text;


namespace Proxys
{
    public class ProxyBaseRest
    {
        public Y DeserializarJSON<T, Y>(T request, string url, bool consultaSap = false)
        {
            var utilitarioRest = new UtilitarioRest();
            return utilitarioRest.DeserializarJSON<T, Y>(request, url, consultaSap: consultaSap);
        }
    }
	public class UtilitarioRest
    {
        public Y DeserializarJSON<T, Y>(T request, string url, string soapAction = "", bool consultaSap = false)
        {
            //if (url.IndexOf("Seguridad") < 0)
            //    url = url.Replace("http://tramoldev01.tramarsa.com.pe:2020", "http://localhost:8733");
            try
            {
                var RESTProxy = new WebClient();
                if (!string.IsNullOrEmpty(soapAction))
                {
                    RESTProxy.Headers["SOAPAction"] = soapAction;
                }
                RESTProxy.Headers["Content-type"] = "application/json";
                Stream stream;
                MemoryStream ms = new MemoryStream();
                if (request.ToString() == string.Empty)
                {
                    //stream = RESTProxy.OpenRead(url);
                    ms = new MemoryStream(new UTF8Encoding().GetBytes(""));
                }
                else
                {
                    if (consultaSap)
                    {
                        string jsonrpt = JsonConvert.SerializeObject(request, Formatting.None, new IsoDateTimeConverter() { DateTimeFormat = "dd.MM.yyyy" });// HH:mm:ss
                        ms = new MemoryStream(new UTF8Encoding().GetBytes(jsonrpt));
                    }
                    else
                    {
                        var serializerToUpload = new DataContractJsonSerializer(typeof(T));
                        serializerToUpload.WriteObject(ms, request);
                    }

                    ms.Position = 0;
                    var sr = new StreamReader(ms);
                    sr.ReadToEnd();
                    string strms = Encoding.UTF8.GetString(ms.ToArray());
                    

                }
                var dc = System.Text.Encoding.UTF8.GetString(RESTProxy.UploadData(url, "POST", ms.ToArray())).ToCharArray();
                var data = System.Text.Encoding.UTF8.GetBytes(dc);

                Stream stream_response;
                stream_response = new MemoryStream(data);
                stream_response.Position = 0;
                var sr_response = new StreamReader(stream_response);
                sr_response.ReadToEnd();

                string strms_response = Encoding.UTF8.GetString(data.ToArray());

                stream = new MemoryStream(data);


                Y resultServicio;
                if (consultaSap)
                {
                    StreamReader sReader = new StreamReader(stream);
                    string outResult = sReader.ReadToEnd();

                    resultServicio = (Y)JsonConvert.DeserializeObject(outResult, typeof(Y), new JsonSerializerSettings() { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore });
                }
                else
                {
                    var obj = new DataContractJsonSerializer(typeof(Y));
                    resultServicio = (Y)obj.ReadObject(stream);
                }
                return resultServicio;
            }
            catch (Exception ex)
            {
                throw new ApplicationException(ex.Message);
            }
        }
    }
	
	
}