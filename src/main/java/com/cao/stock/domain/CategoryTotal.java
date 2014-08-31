package com.cao.stock.domain;

import java.io.Serializable;

/**
 * TODO Comment of Account
 * 
 * @author caoyaojun
 */
public class CategoryTotal implements Serializable {

    private static final long serialVersionUID = 8751282105532159742L;

    private Integer           category;
    private String            stockNumber;
    private String            inStockNumber;
    private Integer           inStockWorth;
    private Integer           outStockNumber;
    private Double            outStockWorth;

    public Integer getCategory() {
        return category;
    }

    public void setCategory(Integer category) {
        this.category = category;
    }

    public String getStockNumber() {
        return stockNumber;
    }

    public void setStockNumber(String stockNumber) {
        this.stockNumber = stockNumber;
    }

    public String getInStockNumber() {
        return inStockNumber;
    }

    public void setInStockNumber(String inStockNumber) {
        this.inStockNumber = inStockNumber;
    }

    public Integer getInStockWorth() {
        return inStockWorth;
    }

    public void setInStockWorth(Integer inStockWorth) {
        this.inStockWorth = inStockWorth;
    }

    public Integer getOutStockNumber() {
        return outStockNumber;
    }

    public void setOutStockNumber(Integer outStockNumber) {
        this.outStockNumber = outStockNumber;
    }

    public Double getOutStockWorth() {
        return outStockWorth;
    }

    public void setOutStockWorth(Double outStockWorth) {
        this.outStockWorth = outStockWorth;
    }

}
