package com.cao.stock.web.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSON;
import com.cao.stock.domain.Unit;

/**
 * TODO Comment of parseJson
 * 
 * @author caoyaojun
 */
public class parseJson {

    public static <T> List<T> parse(String jsonStr, Class<T> t) {
        if (StringUtils.startsWith(jsonStr, "[")) {
            List<T> lists = JSON.parseArray(jsonStr, t);
            return lists;
        } else {
            T obT = JSON.parseObject(jsonStr, t);
            List<T> list = new ArrayList<T>();
            list.add(obT);
            return list;
        }
    }

}
