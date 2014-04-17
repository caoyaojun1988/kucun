package com.cao.stock.service.util;

/**
 * TODO Comment of NumberFormatHelper
 * 
 * @author caoyaojun
 */
public class NumberFormatHelper {

    public static Double format(Double value) {
        if (value != null) {
            return (double) Math.round(value * 100) / 100;
        }
        return null;
    }

    public static void main(String[] args) {
        System.out.println(format(12.3333));
    }
}
