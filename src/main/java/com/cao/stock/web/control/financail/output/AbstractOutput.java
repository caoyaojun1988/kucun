package com.cao.stock.web.control.financail.output;

import com.cao.stock.web.control.financail.domain.AccountItem;
import com.cao.stock.web.util.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;

import java.text.NumberFormat;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by caoyaojun on 11/1/14.
 */
public abstract class AbstractOutput {

    protected static final String exclued = "减：";
    private Map<String, AccountItem> values1;
    private Map<String, AccountItem> values2;
    private Map<String, AccountItem> values3;
    private Map<String, AccountItem> values4;
    private Map<String, AccountItem> values5;

    protected void setCellValue(String cell0Value, HSSFCell cell1) {
        if (cell1 != null) {
            String mapper = ExcelUtil.getString(cell1);
            if (StringUtils.isNotBlank(mapper)) {
                String[] split = StringUtils.split(mapper, "|");
                if (split.length == 2) {
                    int index = Integer.valueOf(split[0]);
                    int id = Integer.valueOf(split[1]);
                    AccountItem accountItem = getAccountItem(index, cell0Value);
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

    protected Double processValue(Double value) {
        NumberFormat numberFormat = NumberFormat.getNumberInstance();
        numberFormat.setMaximumFractionDigits(2);
        numberFormat.setMinimumFractionDigits(2);
        if (value == null || value == 0) {
            return 0D;
        } else {
            return value  ;
            // return numberFormat.format(value / 100.00D);
        }
    }

    private AccountItem getAccountItem(int index, String cell0Value) {
        Map<String, AccountItem> values = new HashMap<String, AccountItem>();
        switch (index) {
            case 1:
                values = this.values1;
                break;
            case 2:
                values = this.values2;
                break;
            case 3:
                values = this.values3;
                break;
            case 4:
                values = this.values4;
                break;
            case 5:
                values = this.values5;
                break;
            default:
        }
        String replace = StringUtils.replace(cell0Value.trim(), exclued, "");
        return values.get(replace.trim());
    }


    public void setValues1(Map<String, AccountItem> values1) {
        this.values1 = values1;
    }

    public void setValues2(Map<String, AccountItem> values2) {
        this.values2 = values2;
    }

    public void setValues3(Map<String, AccountItem> values3) {
        this.values3 = values3;
    }

    public void setValues4(Map<String, AccountItem> values4) {
        this.values4 = values4;
    }

    public void setValues5(Map<String, AccountItem> values5) {
        this.values5 = values5;
    }
}
