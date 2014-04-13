package com.cao.stock.domain;

import java.io.Serializable;

/**
 * TODO Comment of Account
 * 
 * @author caoyaojun
 */
public class Staff implements Serializable {

    private static final long serialVersionUID = 8751282105532159742L;

    private Integer           id;
    private String            name;
    private String            pinyinForName;
    private Integer           department;

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

    public Integer getDepartment() {
        return department;
    }

    public void setDepartment(Integer department) {
        this.department = department;
    }

    public void setPinyinForName(String pinyinForName) {
        this.pinyinForName = pinyinForName;
    }

    public String getPinyinForName() {
        return pinyinForName;
    }

}
