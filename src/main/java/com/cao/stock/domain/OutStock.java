package com.cao.stock.domain;

import java.io.Serializable;
import java.util.Date;

/**
 * TODO Comment of Account
 * 
 * @author caoyaojun
 */
public class OutStock implements Serializable {

    private static final long serialVersionUID = 8751282105532159742L;

    private Integer           id;
    private String            orderId;
    private Date              createDate;
    private Date              modifyDate;
    private Integer           stock;
    private Integer           number;
    private Double            worth;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getModifyDate() {
        return modifyDate;
    }

    public void setModifyDate(Date modifyDate) {
        this.modifyDate = modifyDate;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
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

}
