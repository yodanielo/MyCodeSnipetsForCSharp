
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Excel=Microsoft.Office.Interop.Excel;
using System.Globalization;

namespace dGrid.clases
{
	/// <summary>
    /// Exporta un resultado a Excel
    /// </summary>
    public class ExportarExcel
    {
        private Excel.Application app;
        private Excel.Workbook workbook;
        private dynamic sheet;

        public ExportarExcel()
        {
            app = new Excel.Application();
            app.Visible=false;
            Libro();
        }
        public ExportarExcel(String path)
        {
            app = new Excel.Application();
            Libro(path);
            irHoja(1);
        }
        public void Libro(String path="")
        {
            if(string.IsNullOrEmpty(path))
                workbook = app.Workbooks.Add();
            else
                workbook = app.Workbooks.Open(path);
            irHoja(1);
        }
        public void irHoja(int? index=null) {
            if (index == null)
                sheet = workbook.Worksheets.Add();
            else
                sheet = workbook.Worksheets[index];
        }
        public void ExportarResultado(object DataSource,bool mostrarApp=false){
            System.Windows.Forms.DataGridView dg1 = new System.Windows.Forms.DataGridView();
            dg1.DataSource = DataSource;
            //seteo headers
            for (int i = 0; i < dg1.Columns.Count; i++)
            {
                var item = dg1.Columns[i];
                sheet.Range(getLetra(i, 1)).Value = item.HeaderText;
            }
            //seteo rows
            for (int i = 0; i < dg1.Rows.Count; i++)
            {
                var row = dg1.Rows[i];
                for (int j = 0; j < dg1.Columns.Count; j++)
                {
                    sheet.Range(getLetra(j,i+2)).Value = row.Cells[j].Value;
                }
            }
            Visible = mostrarApp;
        }

        public Boolean Visible
        {
            get { return app.Visible; }
            set { app.Visible = value;}
        }

        public Boolean Guardar(String path="")
        {
            try
            {
                if (String.IsNullOrEmpty(path))
                    workbook.Save();
                else
                    workbook.SaveAs(path);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public Boolean GuardarYCerrar(String path="")
        {
            Boolean rpt = true;
            rpt = Guardar(path);
            workbook.Close();
            return rpt;
        }

        private string getLetra(int indice,int num){
            indice++;
            String []Letras={"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"};
            int resto=indice%Letras.Length;
            if (resto == 0)
                return Letras[indice]+num.ToString();
            else
                return Letras[resto] + Letras[indice]+num.ToString();
        }
    }
}
