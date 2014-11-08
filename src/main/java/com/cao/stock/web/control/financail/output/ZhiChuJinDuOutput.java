package com.cao.stock.web.control.financail.output;

import com.cao.stock.web.control.financail.main.UI;
import com.cao.stock.web.util.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import java.util.Map;

/**
 * Created by caoyaojun on 11/1/14.
 */
public class ZhiChuJinDuOutput extends AbstractOutput {

    private Map<String, Double> values;

    public ZhiChuJinDuOutput() {
        super();
    }


    public HSSFWorkbook CreateExcel(HSSFWorkbook workbook) {
        try {
            // 获得 sheet总数
            int sheetCount = workbook.getNumberOfSheets();
            // 遍历sheet
            for (int sheetIndex = 3; sheetIndex < 4; sheetIndex++) {
                //   System.out.println("sheetIndex =" + sheetIndex);
                // 获得指定的sheet对象
                HSSFSheet sheet = workbook.getSheetAt(sheetIndex);
                // 获得本sheet的总行数
                int rowCount = sheet.getLastRowNum();
                // 如果没有数据
                if (rowCount <= 0) {
                    return workbook;
                }
                // 如果有数据 进入下边
                // 遍历行row ignoreRows忽略的行数。即标题行，不取
                for (int rowIndex = 4; rowIndex <= rowCount; rowIndex++) {
                    HSSFRow row = sheet.getRow(rowIndex);
                    // 如果此行为空，则进入下一个循环
                    if (row == null) {
                        continue;
                    }

                    try {
                        HSSFCell cell1 = row.getCell(3);
                        String cell1Value = ExcelUtil.getString(cell1);
                        if (StringUtils.isNotBlank(cell1Value) && values.get(cell1Value) != null) {
                            HSSFCell cell4 = row.getCell(4);
                            if (cell4 == null) {
                                cell4 = row.createCell(4);
                            }
                            cell4.setCellValue(values.get(cell1Value));
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 1 + ",value=" + row.getCell(0) + ",ERROR=" + e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            UI.showException("总体进度ERROR=" + e.getMessage() + "");
        }
        return workbook;
    }


    public void setValues(Map<String, Double> values) {
        this.values = values;
    }
}
