package com.cao.stock.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.InStock;
import com.cao.stock.domain.OutStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.Stock;
import com.cao.stock.persistence.InStockMapper;

/**
 * TODO Comment of InStockService
 * 
 * @author caoyaojun
 */
@Service
public class InStockService {

    @Autowired
    private InStockMapper     InStockMapper;
    @Autowired
    private StockService      stockService;
    @Autowired
    private InOutStockService inOutStockService;
    @Autowired
    private OutStockService   outStockService;

    @Transactional
    public void addInStock(InStock inStock) {
        insertInStock(inStock);

        Stock stock = new Stock();
        stock.setId(inStock.getStock());
        stock.setNumber(inStock.getNumber());
        stock.setWorth(inStock.getWorth() * inStock.getNumber());
        stockService.inStock(stock);
    }

    @Transactional
    public void addInOutStock(InStock inStock, String inOutStockStaff, String inOutDepartment) {
        inStock = insertInStock(inStock);

        OutStock outStock = new OutStock();
        outStock.setCreateDate(inStock.getCreateDate());
        outStock.setDepartment(inOutDepartment);
        outStock.setModifyDate(new Date());
        outStock.setNumber(inStock.getNumber());
        String orderId = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
        outStock.setOrderId(orderId);
        outStock.setStaff(inOutStockStaff);
        outStock.setStock(inStock.getStock());
        outStock.setWorth(inStock.getNumber() * inStock.getWorth());

        outStockService.addInOutStock(outStock, inStock);
    }

    private InStock insertInStock(InStock inStock) {
        InStock oldInStock = InStockMapper.queryInStockById(inStock.getId());
        if (oldInStock != null && oldInStock.getId() != null) {
            throw new RuntimeException("addInStock is exist");
        }
        inStock.setModifyDate(new Date());
        inStock.setRemainderNumber(inStock.getNumber());
        inStock.setStatus("in");
        InStockMapper.addInStock(inStock);
        return inStock;
    }

    @Transactional
    public void modifyInStock(InStock oldInStock, InStock newInStock) {
        // TODO 价格变化
        newInStock.setModifyDate(new Date());
        if (oldInStock.getNumber() > newInStock.getNumber()) {// 撤銷
            int deleteNumber = oldInStock.getNumber() - newInStock.getNumber();
            if (deleteNumber <= oldInStock.getRemainderNumber()) { // 可撤销
                if (newInStock.getNumber() == 0) {
                    InStockMapper.logicDeleteInStockById(newInStock.getId());
                } else {
                    newInStock.setRemainderNumber(newInStock.getRemainderNumber() - deleteNumber);
                    InStockMapper.modifyInStockById(newInStock);
                }
                Stock stock = new Stock();
                stock.setId(newInStock.getStock());
                stock.setNumber(deleteNumber);
                stock.setWorth(deleteNumber * newInStock.getWorth());
                stockService.outStock(stock);
            } else {
                // List<InOutStock> inOutStocks = inOutStockService.queryInOutStockByInStockId();
                // TODO 已经出库了
            }

        } else if (oldInStock.getNumber() < newInStock.getNumber()) {// 增加
            newInStock.setRemainderNumber(newInStock.getRemainderNumber()
                                          + (newInStock.getNumber() - oldInStock.getNumber()));
            InStockMapper.modifyInStockById(newInStock);

            Stock stock = new Stock();
            stock.setId(newInStock.getStock());
            stock.setNumber(newInStock.getNumber() - oldInStock.getNumber());
            stock.setWorth(stock.getNumber() * newInStock.getWorth());
            stockService.inStock(stock);
        } else {
            InStockMapper.modifyInStockById(newInStock);
        }
    }

    public List<InStock> listAllInStocks(QueryParameter queryParameter) {
        return InStockMapper.listAllInStocks(queryParameter);
    }

    public Integer countAllInStocks(QueryParameter queryParameter) {
        return InStockMapper.countAllInStocks(queryParameter);
    }

    public InStock queryInStockById(Integer id) {
        return InStockMapper.queryInStockById(id);
    }
}
