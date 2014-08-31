package com.cao.stock.domain;

import java.io.Serializable;
import java.util.Date;

/**
 * TODO Comment of Account
 * 
 * @author caoyaojun
 */
public class StockDetail implements Serializable {

    private static final long serialVersionUID = 8751282105532159742L;

    private String            orderId;
    private Integer           stockId;
    private Date              createDate;
    private String            inOrOut;
    private Integer           number;
    private Integer           remainderNumber;

    public Integer getStockId() {
        return stockId;
    }

    public void setStockId(Integer stockId) {
        this.stockId = stockId;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getInOrOut() {
        return inOrOut;
    }

    public void setInOrOut(String inOrOut) {
        this.inOrOut = inOrOut;
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

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getOrderId() {
        return orderId;
    }

}
