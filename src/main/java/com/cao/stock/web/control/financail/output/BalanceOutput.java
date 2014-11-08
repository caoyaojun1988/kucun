package com.cao.stock.web.control.financail.output;

import com.cao.stock.web.control.financail.main.UI;
import com.cao.stock.web.util.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

/**
 * Created by caoyaojun on 11/1/14.
 */
public class BalanceOutput extends AbstractOutput {


    public BalanceOutput() {
        super();
    }

    public HSSFWorkbook CreateExcel(HSSFWorkbook workbook) {
        try {
            // 获得 sheet总数
            int sheetCount = workbook.getNumberOfSheets();
            // 遍历sheet
            for (int sheetIndex = 0; sheetIndex < 1; sheetIndex++) {
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
                for (int rowIndex = 5; rowIndex <= rowCount; rowIndex++) {
                    HSSFRow row = sheet.getRow(rowIndex);
                    // 如果此行为空，则进入下一个循环
                    if (row == null) {
                        continue;
                    }

                    try {
                        HSSFCell cell0 = row.getCell(0);
                        String cell0Value = ExcelUtil.getString(cell0);
                        if (StringUtils.isNotBlank(cell0Value)) {
                            HSSFCell cell1 = row.getCell(1);
                            setCellValue(cell0Value, cell1);

                            HSSFCell cell2 = row.getCell(2);
                            setCellValue(cell0Value, cell2);
                        }
                    } catch (Exception e) {
                        throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 1 + ",value=" + row.getCell(0) + ",ERROR=" + e.getMessage());
                    }

                    try {
                        HSSFCell cell3 = row.getCell(3);
                        String cell3Value = ExcelUtil.getString(cell3);
                        if (StringUtils.isNotBlank(cell3Value)) {

                            HSSFCell cell4 = row.getCell(4);
                            setCellValue(cell3Value, cell4);

                            HSSFCell cell5 = row.getCell(5);
                            setCellValue(cell3Value, cell5);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 1 + ",value=" + row.getCell(3) + ",ERROR=" + e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            UI.showException("资产负载表 ERROR:" + e.getMessage() + "");
        }
        return workbook;
    }


}
