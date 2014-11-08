package com.cao.stock.web.control.financail.output;

import com.cao.stock.web.control.financail.domain.AccountItem;
import com.cao.stock.web.control.financail.input.TotalAcountInput;
import com.cao.stock.web.control.financail.main.UI;
import com.cao.stock.web.util.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import java.util.Map;

/**
 * Created by caoyaojun on 11/1/14.
 */
public class ZhiChuMingXiOutput extends AbstractOutput {

    private static final String exclued = "减：";
    private Map<String, AccountItem> baseValues;
    private Map<String, AccountItem> projectValues;

    public ZhiChuMingXiOutput() {
        super();
    }


    public HSSFWorkbook CreateExcel(HSSFWorkbook workbook) {
        try {
            // 获得 sheet总数
            int sheetCount = workbook.getNumberOfSheets();
            // 遍历sheet
            for (int sheetIndex = 2; sheetIndex < 3; sheetIndex++) {
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
                        HSSFCell cell1 = row.getCell(0);
                        String cell1Value = ExcelUtil.getString(cell1);
                        if (StringUtils.isNotBlank(cell1Value)) {
                            if(cell1Value.endsWith(TotalAcountInput.other)){
                                String replaceAll = cell1Value.replaceAll("\\d+", "");
                                cell1.setCellValue(replaceAll);
                            }

                            HSSFCell cell2 = row.getCell(1);
                            setCellValue(getBaseValues(), cell1Value, cell2);

                            HSSFCell cell3 = row.getCell(2);
                            setCellValue(getProjectValues(), cell1Value, cell3);

                            HSSFCell cell4 = row.getCell(3);
                            setCellValue(getBaseValues(), cell1Value, cell4);

                            HSSFCell cell5 = row.getCell(4);
                            setCellValue(getProjectValues(), cell1Value, cell5);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 1 + ",value=" + row.getCell(0) + ",ERROR=" + e.getMessage());
                    }
                }
            }


        } catch (Exception e) {
            e.printStackTrace();
            UI.showException("明细表ERROR=" + e.getMessage() + "");
        }
        return workbook;
    }

    protected void setCellValue(Map<String, AccountItem> srcValue, String cell0Value, HSSFCell cell1) {
        if (cell1 != null) {
            String mapper = ExcelUtil.getString(cell1);
            if (StringUtils.isNotBlank(mapper) && NumberUtils.isNumber(mapper)) {
                int index = Double.valueOf(mapper).intValue();
                AccountItem accountItem;
                if(!cell0Value.endsWith(TotalAcountInput.other)){
                    String replaceAll = cell0Value.replaceAll("\\(?\\（?\\d+\\)?\\）?", "");
                    String replace = StringUtils.replace(replaceAll, "、", "");
                    String value = StringUtils.replace(replace, " ", "");
                      accountItem = srcValue.get(value);
                }else {
                      accountItem = srcValue.get(cell0Value);
                }
                if (accountItem != null && accountItem.getValueById(index) != null && accountItem.getValueById(index) != 0) {
                    cell1.setCellValue(processValue(accountItem.getValueById(index)));
                    return;
                }
                cell1.setCellValue("");
            }
        }
    }


    public Map<String, AccountItem> getBaseValues() {
        return baseValues;
    }

    public void setBaseValues(Map<String, AccountItem> baseValues) {
        this.baseValues = baseValues;
    }

    public Map<String, AccountItem> getProjectValues() {
        return projectValues;
    }

    public void setProjectValues(Map<String, AccountItem> projectValues) {
        this.projectValues = projectValues;
    }
}
