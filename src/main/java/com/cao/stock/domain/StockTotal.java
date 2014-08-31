package com.cao.stock.domain;

import java.io.Serializable;

/**
 * TODO Comment of Account
 * 
 * @author caoyaojun
 */
public class StockTotal implements Serializable {

    private static final long serialVersionUID = 8751282105532159742L;

    private Integer           stock;
    private String            stockName;
    private String            stockSpecification;
    private Integer           stockUnit;
    private Integer           stockNumber;
    private Double            stockWorth;
    private Integer           number;
    private Integer           department;
    private String            departmentName;

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getStockName() {
        return stockName;
    }

    public void setStockName(String stockName) {
        this.stockName = stockName;
    }

    public String getStockSpecification() {
        return stockSpecification;
    }

    public void setStockSpecification(String stockSpecification) {
        this.stockSpecification = stockSpecification;
    }

    public Integer getStockUnit() {
        return stockUnit;
    }

    public void setStockUnit(Integer stockUnit) {
        this.stockUnit = stockUnit;
    }

    public Integer getStockNumber() {
        return stockNumber;
    }

    public void setStockNumber(Integer stockNumber) {
        this.stockNumber = stockNumber;
    }

    public Double getStockWorth() {
        return stockWorth;
    }

    public void setStockWorth(Double stockWorth) {
        this.stockWorth = stockWorth;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public void setDepartment(Integer department) {
        this.department = department;
    }

    public Integer getDepartment() {
        return department;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getDepartmentName() {
        return departmentName;
    }

}
