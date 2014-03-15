package com.cao.stock.domain;

import java.io.Serializable;

/**
 * TODO Comment of Account
 * 
 * @author caoyaojun
 */
public class InOutStock implements Serializable {

    private static final long serialVersionUID = 8751282105532159742L;

    private Integer           id;
    private Integer           outStock;
    private Integer           inStock;
    private Integer           number;
    private Double            worth;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getOutStock() {
        return outStock;
    }

    public void setOutStock(Integer outStock) {
        this.outStock = outStock;
    }

    public Integer getInStock() {
        return inStock;
    }

    public void setInStock(Integer inStock) {
        this.inStock = inStock;
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
