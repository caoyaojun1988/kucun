package com.cao.stock.web.control.financail.input;

import com.cao.stock.web.control.financail.domain.AccountItem;
import com.cao.stock.web.util.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by caoyaojun on 11/1/14.
 */
public class TotalAcountInput {

    public static final String other = "其他";
    private List<AccountItem> result;
    private InputStream       inputStream;

    public TotalAcountInput() {

    }


    public List<AccountItem> importExcel() throws Exception {

        this.result = new ArrayList<AccountItem>();
        // 获取工作薄workbook
        HSSFWorkbook workbook = new HSSFWorkbook(inputStream); // 读取文件流
        // 获得 sheet总数
        int sheetCount = workbook.getNumberOfSheets();
        // 遍历sheet
        for (int sheetIndex = 0; sheetIndex < sheetCount; sheetIndex++) {
            //   System.out.println("sheetIndex =" + sheetIndex);
            // 获得指定的sheet对象
            HSSFSheet sheet = workbook.getSheetAt(sheetIndex);
            // 获得本sheet的总行数
            int rowCount = sheet.getLastRowNum();
            // 如果没有数据
            if (rowCount <= 0) {
                return result;
            }
            // 如果有数据 进入下边
            // 遍历行row ignoreRows忽略的行数。即标题行，不取
            for (int rowIndex = 4; rowIndex <= rowCount; rowIndex++) {
                //     System.out.println("rowIndex =" + rowIndex);
                // 获得行row对象
                HSSFRow row = sheet.getRow(rowIndex);
                // 如果此行为空，则进入下一个循环
                if (row == null) {
                    continue;
                }
                HSSFCell cell = row.getCell(0);
                if (cell == null || StringUtils.isBlank(ExcelUtil.getString(cell)) || !NumberUtils.isNumber(ExcelUtil.getString(cell))) {
                    continue;
                }
                AccountItem accountItem = new AccountItem();
                //id
                try {
                    HSSFCell cell0 = row.getCell(0);
                    Long id = Long.valueOf(ExcelUtil.getString(cell0));
                    accountItem.setId(id);
                } catch (Exception e) {
                    e.printStackTrace();
                    throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 1 + ",value=" + row.getCell(0) + ",ERROR=" + e.getMessage());
                }
                //name
                try {
                    HSSFCell cell1 = row.getCell(1);
                    String name = (ExcelUtil.getString(cell1));
                    if (other.equals(name.trim())) {
                        name = accountItem.getId() + name;
                    }
                    accountItem.setName(name);
                } catch (Exception e) {
                    throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 2 + ",value=" + row.getCell(1) + ",ERROR=" + e.getMessage());
                }
                //startBorrow
                try {
                    HSSFCell cell2 = row.getCell(2);
                    if (cell2 != null) {
                        Double startBorrow = ExcelUtil.getDouble((cell2));
                        accountItem.setStartBorrow(startBorrow);
                    }
                } catch (Exception e) {
                    throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 3 + ",value=" + row.getCell(2) + ",ERROR=" + e.getMessage());
                }
                //startLend
                try {
                    HSSFCell cell3 = row.getCell(3);
                    if (cell3 != null) {
                        Double startBorrow = ExcelUtil.getDouble((cell3));
                        accountItem.setStartLend(startBorrow);
                    }
                } catch (Exception e) {
                    throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 4 + ",value=" + row.getCell(3) + ",ERROR=" + e.getMessage());
                }
                //thisBorrow
                try {
                    HSSFCell cell4 = row.getCell(4);
                    if (cell4 != null) {
                        Double thisBorrow = ExcelUtil.getDouble((cell4));
                        accountItem.setThisBorrow(thisBorrow);
                    }
                } catch (Exception e) {
                    throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 5 + ",value=" + row.getCell(4) + ",ERROR=" + e.getMessage());
                }
                //thisLend
                try {
                    HSSFCell cell5 = row.getCell(5);
                    if (cell5 != null) {
                        Double thisLend = ExcelUtil.getDouble((cell5));
                        accountItem.setThisLend(thisLend);
                    }
                } catch (Exception e) {
                    throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 6 + ",value=" + row.getCell(5) + ",ERROR=" + e.getMessage());
                }
                //totalBorrow
                try {
                    HSSFCell cell6 = row.getCell(6);
                    if (cell6 != null) {
                        Double totalBorrow = ExcelUtil.getDouble((cell6));
                        accountItem.setTotalBorrow(totalBorrow);
                    }
                } catch (Exception e) {
                    throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 7 + ",value=" + row.getCell(6) + ",ERROR=" + e.getMessage());
                }
                //totalLend
                try {
                    HSSFCell cell7 = row.getCell(7);
                    if (cell7 != null) {
                        Double totalLend = ExcelUtil.getDouble((cell7));
                        accountItem.setTotalLend(totalLend);
                    }
                } catch (Exception e) {
                    throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 8 + ",value=" + row.getCell(7) + ",ERROR=" + e.getMessage());
                }
                //endBorrow
                try {
                    HSSFCell cell8 = row.getCell(8);
                    if (cell8 != null) {
                        Double endBorrow = ExcelUtil.getDouble((cell8));
                        accountItem.setEndBorrow(endBorrow);
                    }
                } catch (Exception e) {
                    throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 9 + ",value=" + row.getCell(8) + ",ERROR=" + e.getMessage());
                }
                //endLend
                try {
                    HSSFCell cell9 = row.getCell(9);
                    if (cell9 != null) {
                        Double endLend = ExcelUtil.getDouble((cell9));
                        accountItem.setEndLend(endLend);
                    }
                } catch (Exception e) {
                    throw new IllegalArgumentException("ROW=" + rowIndex + ",culomn=" + 10 + ",value=" + row.getCell(9) + ",ERROR=" + e.getMessage());
                }
                result.add(accountItem);
            }
        }
        return result;
    }


    public List<AccountItem> getResult() {
        return result;
    }

    public void setResult(List<AccountItem> result) {
        this.result = result;
    }

    public void setInputStream(InputStream inputStream) {
        this.inputStream = inputStream;
    }
}
