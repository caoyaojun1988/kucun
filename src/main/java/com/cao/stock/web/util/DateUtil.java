package com.cao.stock.web.util;

/**
 * Created by caoyaojun on 11/1/14.
 */
public class DateUtil {

    public static String getDateString() {
        long currentTime = System.currentTimeMillis();
        java.util.Date date = new java.util.Date(currentTime);
        java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyyMMddHHmmss");
        return formatter.format(date);
    }
}
