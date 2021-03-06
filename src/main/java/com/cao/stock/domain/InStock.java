package com.cao.stock.domain;

import java.io.Serializable;
import java.util.Date;

/**
 * TODO Comment of Account
 *
 * @author caoyaojun
 */
public class InStock implements Serializable {

    private static final long serialVersionUID = 8751282105532159742L;

    private Integer id;
    private String  name;
    private String  orderId;
    private Date    createDate;
    private Date    modifyDate;
    private Integer stock;
    private Integer number;
    private Integer remainderNumber;
    private Double  worth;
    private Double  totalWorth;
    private String  status;

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

    public Integer getRemainderNumber() {
        return remainderNumber;
    }

    public void setRemainderNumber(Integer remainderNumber) {
        this.remainderNumber = remainderNumber;
    }

    public Double getWorth() {
        return worth;
    }

    public void setWorth(Double worth) {
        this.worth = worth;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setTotalWorth(Double totalWorth) {
        this.totalWorth = totalWorth;
    }

    public Double getTotalWorth() {
        return totalWorth;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
