package com.cao.stock.domain;

import java.io.Serializable;

/**
 * TODO Comment of Account
 * 
 * @author caoyaojun
 */
public class Category implements Serializable {

    private static final long serialVersionUID = 8751282105532159742L;

    private Integer           uid;
    private Integer           id;
    private String            name;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public Integer getUid() {
        return uid;
    }

}
