package com.cao.stock.domain;

import java.io.Serializable;
import java.util.Date;

/**
 * TODO Comment of Account
 * 
 * @author caoyaojun
 */
public class StockOrder implements Serializable {

    private static final long serialVersionUID = 8751282105532159742L;

    private String            id;
    private Date              createDate;
    private Date              modifyDate;
    private Integer           totalNumber;
    private Double            totalWorth;
    private String            mark;
    private Integer           department;
    private Integer           staff;
    private String            status;

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public Integer getTotalNumber() {
        return totalNumber;
    }

    public void setTotalNumber(Integer totalNumber) {
        this.totalNumber = totalNumber;
    }

    public Integer getStaff() {
        return staff;
    }

    public void setStaff(Integer staff) {
        this.staff = staff;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setTotalWorth(Double totalWorth) {
        this.totalWorth = totalWorth;
    }

    public Double getTotalWorth() {
        return totalWorth;
    }

    public void setMark(String mark) {
        this.mark = mark;
    }

    public String getMark() {
        return mark;
    }

    public void setDepartment(Integer department) {
        this.department = department;
    }

    public Integer getDepartment() {
        return department;
    }
}
