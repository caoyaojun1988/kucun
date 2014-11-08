package com.cao.stock.web.control.financail.domain;

/**
 * Created by caoyaojun on 11/1/14.
 */
public class AccountItem {
    private Long   id;
    private String name;
    private Double startBorrow;
    private Double startLend;
    private Double thisBorrow;
    private Double thisLend;
    private Double totalBorrow;
    private Double totalLend;
    private Double endBorrow;
    private Double endLend;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getStartBorrow() {
        return startBorrow;
    }

    public void setStartBorrow(Double startBorrow) {
        this.startBorrow = startBorrow;
    }

    public Double getStartLend() {
        return startLend;
    }

    public void setStartLend(Double startLend) {
        this.startLend = startLend;
    }

    public Double getThisBorrow() {
        return thisBorrow;
    }

    public void setThisBorrow(Double thisBorrow) {
        this.thisBorrow = thisBorrow;
    }

    public Double getThisLend() {
        return thisLend;
    }

    public void setThisLend(Double thisLend) {
        this.thisLend = thisLend;
    }

    public Double getTotalBorrow() {
        return totalBorrow;
    }

    public void setTotalBorrow(Double totalBorrow) {
        this.totalBorrow = totalBorrow;
    }

    public Double getTotalLend() {
        return totalLend;
    }

    public void setTotalLend(Double totalLend) {
        this.totalLend = totalLend;
    }

    public Double getEndBorrow() {
        return endBorrow;
    }

    public void setEndBorrow(Double endBorrow) {
        this.endBorrow = endBorrow;
    }

    public Double getEndLend() {
        return endLend;
    }

    public void setEndLend(Double endLend) {
        this.endLend = endLend;
    }

    public Double getValueById(int index) {
        switch (index) {
            case 1:
                return this.getStartBorrow();
            case 2:
                return this.getStartLend();
            case 3:
                return this.getThisBorrow();
            case 4:
                return this.getThisLend();
            case 5:
                return this.getTotalBorrow();
            case 6:
                return this.getTotalLend();
            case 7:
                return this.getEndBorrow();
            case 8:
                return this.getEndLend();
            default:
                return 0D;
        }
    }
}
