package com.cao.stock.web.control.financail.input;

import com.cao.stock.web.util.*;
import com.cao.stock.web.control.financail.domain.ProjectItem;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import java.io.FileInputStream;
import java.io.InputStream;

/**
 * Created by caoyaojun on 11/1/14.
 */
public class ProjectItemInput {
    private InputStream inputStream;

    public ProjectItemInput() {

    }

    public ProjectItem importExcel() throws Exception {

        // 获取工作薄workbook
        HSSFWorkbook workbook = new HSSFWorkbook(inputStream); // 读取文件流
        // 获得 sheet总数
        int sheetCount = workbook.getNumberOfSheets();
        // 遍历sheet
        ProjectItem currentMonthDetail = new ProjectItem();
        for (int sheetIndex = 0; sheetIndex < 1; sheetIndex++) {
            //   System.out.println("sheetIndex =" + sheetIndex);
            // 获得指定的sheet对象
            HSSFSheet sheet = workbook.getSheetAt(sheetIndex);
            // 获得本sheet的总行数
            int rowCount = sheet.getLastRowNum();
            // 如果没有数据
            if (rowCount <= 0) {
                return null;
            }
            // 如果有数据 进入下边
            // 遍历行row ignoreRows忽略的行数。即标题行，不取

            for (int rowIndex = rowCount; rowIndex >= 0; rowIndex--) {
                //     System.out.println("rowIndex =" + rowIndex);
                // 获得行row对象
                HSSFRow row = sheet.getRow(rowIndex);
                // 如果此行为空，则进入下一个循环
                if (row == null) {
                    continue;
                }
                HSSFCell cell = row.getCell(3);
                if (cell == null || StringUtils.isBlank(ExcelUtil.getString(cell))) {
                    continue;
                }

                if ("本年累计".equals(ExcelUtil.getString(cell).trim())) {
                    //id
                    try {
                        HSSFCell cell7 = row.getCell(7);
                        if (cell7 != null) {
                            Double caiJi = ExcelUtil.getDouble(cell7);
                            currentMonthDetail.setCaiJi(caiJi);
                        }
                    } catch (Exception e) {
                        throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 1 + ",value=" + row.getCell(7) + ",ERROR=" + e.getMessage());
                    }
                    //name
                    try {
                        HSSFCell cell8 = row.getCell(8);
                        if (cell8 != null) {
                            Double chenLie = ExcelUtil.getDouble(cell8);
                            currentMonthDetail.setChenLie(chenLie);
                        }
                    } catch (Exception e) {
                        throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 2 + ",value=" + row.getCell(8) + ",ERROR=" + e.getMessage());
                    }

                    //thisBorrow
                    try {
                        HSSFCell cell9 = row.getCell(9);
                        if (cell9 != null) {
                            Double yanJiu = ExcelUtil.getDouble(cell9);
                            currentMonthDetail.setYanJiu(yanJiu);
                        }
                    } catch (Exception e) {
                        throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 3 + ",value=" + row.getCell(9) + ",ERROR=" + e.getMessage());
                    }
                    break;
                }
            }
        }
        return currentMonthDetail;
    }

    public void setInputStream(InputStream inputStream) {
        this.inputStream = inputStream;
    }
}
