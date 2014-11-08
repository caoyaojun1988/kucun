package com.cao.stock.web.control.financail.output;

import com.cao.stock.web.control.financail.domain.AccountItem;
import com.cao.stock.web.control.financail.main.UI;
import com.cao.stock.web.util.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by caoyaojun on 11/1/14.
 */
public class ShouZhiOutput extends AbstractOutput {

    private Map<String, AccountItem> currentValues1;
    private Map<String, AccountItem> currentValues2;
    private Map<String, AccountItem> currentValues3;
    private Map<String, AccountItem> currentValues4;
    private Map<String, AccountItem> currentValues5;

    public ShouZhiOutput() {
        super();
    }


    public HSSFWorkbook CreateExcel(HSSFWorkbook workbook) {
        try {
            // 获得 sheet总数
            int sheetCount = workbook.getNumberOfSheets();
            // 遍历sheet
            for (int sheetIndex = 1; sheetIndex < 2; sheetIndex++) {
                //   System.out.println("sheetIndex =" + sheetIndex);
                // 获得指定的sheet对象
                HSSFSheet sheet = workbook.getSheetAt(sheetIndex);
                // 获得本sheet的总行数
                int rowCount = sheet.getLastRowNum();
                // 如果没有数据
                if (rowCount <= 0) {
                    return  workbook;
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
                            setCellValueForCurrent(cell0Value, cell1);

                            HSSFCell cell2 = row.getCell(2);
                            setCellValue(cell0Value, cell2);
                        }
                    } catch (Exception e) {
                        throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 1 + ",value=" + row.getCell(0) + ",ERROR=" + e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            UI.showException("收支表ERROR=" + e.getMessage() + "");
        }
        return  workbook;
    }

    private void setCellValueForCurrent(String cell0Value, HSSFCell cell1) {
        if (cell1 != null) {
            String mapper = ExcelUtil.getString(cell1);
            if (StringUtils.isNotBlank(mapper)) {
                String[] split = StringUtils.split(mapper, "|");
                if (split.length == 2) {
                    int index = Integer.valueOf(split[0]);
                    int id = Integer.valueOf(split[1]);
                    AccountItem accountItem = getAccountItemForCurrent(index, cell0Value);
                    String value = "";
                    if (accountItem != null) {
                        if (accountItem.getValueById(id) != null && accountItem.getValueById(id) != 0) {
                            cell1.setCellValue(processValue(accountItem.getValueById(id)));
                            return;
                        }
                    }
                    cell1.setCellValue("");
                }
            }
        }
    }

    protected AccountItem getAccountItemForCurrent(int index, String cell0Value) {
        Map<String, AccountItem> values = new HashMap<String, AccountItem>();
        switch (index) {
            case 1:
                values = this.currentValues1;
                break;
            case 2:
                values = this.currentValues2;
                break;
            case 3:
                values = this.currentValues3;
                break;
            case 4:
                values = this.currentValues4;
                break;
            case 5:
                values = this.currentValues5;
                break;
            default:
        }
        String replace = StringUtils.replace(cell0Value.trim(), exclued, "");
        return values.get(replace.trim());
    }

    public void setCurrentValues1(Map<String, AccountItem> currentValues1) {
        this.currentValues1 = currentValues1;
    }

    public void setCurrentValues2(Map<String, AccountItem> currentValues2) {
        this.currentValues2 = currentValues2;
    }

    public void setCurrentValues3(Map<String, AccountItem> currentValues3) {
        this.currentValues3 = currentValues3;
    }

    public void setCurrentValues4(Map<String, AccountItem> currentValues4) {
        this.currentValues4 = currentValues4;
    }

    public void setCurrentValues5(Map<String, AccountItem> currentValues5) {
        this.currentValues5 = currentValues5;
    }
}
