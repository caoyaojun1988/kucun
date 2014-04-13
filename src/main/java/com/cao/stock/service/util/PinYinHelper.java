package com.cao.stock.service.util;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;

/**
 * TODO Comment of PinYinHelper
 * 
 * @author caoyaojun
 */
public class PinYinHelper {

    public static String convert(String chines) {
        String firstSpell = converterToFirstSpell(chines);
        String allSpell = converterToSpell(chines);
        return chines + "," + firstSpell + "," + allSpell + "," + firstSpell.toUpperCase() + ","
               + allSpell.toUpperCase();
    }

    /**
     * 汉字转换位汉语拼音首字母，英文字符不变
     * 
     * @param chines 汉字
     * @return 拼音
     */
    public static String converterToFirstSpell(String chines) {
        String pinyinName = "";
        char[] nameChar = chines.toCharArray();
        HanyuPinyinOutputFormat defaultFormat = new HanyuPinyinOutputFormat();
        defaultFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
        defaultFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
        for (int i = 0; i < nameChar.length; i++) {
            if (nameChar[i] > 128) {
                try {
                    String[] reslut = PinyinHelper.toHanyuPinyinStringArray(nameChar[i], defaultFormat);
                    if (reslut == null || reslut.length <= 0) {
                        pinyinName += nameChar[i];
                    } else {
                        pinyinName += reslut[0].charAt(0);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                pinyinName += nameChar[i];
            }
        }
        return pinyinName;
    }

    /**
     * 汉字转换位汉语拼音，英文字符不变
     * 
     * @param chines 汉字
     * @return 拼音
     */
    public static String converterToSpell(String chines) {
        String pinyinName = "";
        char[] nameChar = chines.toCharArray();
        HanyuPinyinOutputFormat defaultFormat = new HanyuPinyinOutputFormat();
        defaultFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
        defaultFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
        for (int i = 0; i < nameChar.length; i++) {
            if (nameChar[i] > 128) {
                try {
                    String[] reslut = PinyinHelper.toHanyuPinyinStringArray(nameChar[i], defaultFormat);
                    if (reslut == null || reslut.length <= 0) {
                        pinyinName += nameChar[i];
                    } else {
                        pinyinName += reslut[0];
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                pinyinName += nameChar[i];
            }
        }
        return pinyinName;
    }

    public static void main(String[] args) {
        System.out.println(converterToFirstSpell("N次贴（小）"));
        System.out.println(converterToSpell("N次贴（小）"));
    }
}
