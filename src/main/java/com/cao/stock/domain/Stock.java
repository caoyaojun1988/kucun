package com.cao.stock.domain;

import java.io.Serializable;

/**
 * TODO Comment of Account
 * 
 * @author caoyaojun
 */
public class Stock implements Serializable {

    private static final long serialVersionUID = 8751282105532159742L;

    private Integer           uid;
    private Integer           id;
    private Integer           category;
    private String            name;
    private String            pinyinForName;
    private String            specification;
    private Integer           unit;
    private Integer           number;
    private Double            worth;
    private String            status;

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCategory() {
        return category;
    }

    public void setCategory(Integer category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Double getWorth() {
        return worth;
    }

    public void setWorth(Double worth) {
        this.worth = worth;
    }

    public String getSpecification() {
        return specification;
    }

    public void setSpecification(String specification) {
        this.specification = specification;
    }

    public Integer getUnit() {
        return unit;
    }

    public void setUnit(Integer unit) {
        this.unit = unit;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setPinyinForName(String pinyinForName) {
        this.pinyinForName = pinyinForName;
    }

    public String getPinyinForName() {
        return pinyinForName;
    }

}
