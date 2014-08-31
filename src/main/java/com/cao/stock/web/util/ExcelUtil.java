package com.cao.stock.web.util;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;

/**
 * TODO Comment of ExcelUtil
 * 
 * @author caoyaojun
 */
public class ExcelUtil {

    public static String getString(HSSFCell cell) {
        if (cell.getCellType() == HSSFCell.CELL_TYPE_STRING) {
            return StringUtils.trim(cell.getRichStringCellValue().getString());
        } else if (cell.getCellType() == HSSFCell.CELL_TYPE_NUMERIC) {
            return String.valueOf(cell.getNumericCellValue());
        } else if (cell.getCellType() == HSSFCell.CELL_TYPE_BOOLEAN) {
            return String.valueOf(cell.getBooleanCellValue());
        } else if (cell.getCellType() == HSSFCell.CELL_TYPE_BLANK) {
            return "";
        } else {
            throw new IllegalArgumentException();
        }
    }
}
