package com.cao.stock.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.InStock;
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

    @Transactional
    public void addInStock(InStock inStock) {
        InStock oldInStock = InStockMapper.queryInStockById(inStock.getId());
        if (oldInStock != null && oldInStock.getId() != null) {
            throw new RuntimeException("addInStock is exist");
        }
        inStock.setModifyDate(new Date());
        inStock.setRemainderNumber(inStock.getNumber());
        inStock.setStatus("in");
        InStockMapper.addInStock(inStock);

        Stock stock = new Stock();
        stock.setId(inStock.getStock());
        stock.setNumber(inStock.getNumber());
        stock.setWorth(inStock.getWorth() * inStock.getNumber());

        stockService.inStock(stock);
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
                    InStockMapper.modifyInStockById(newInStock);
                }
                Stock stock = new Stock();
                stock.setId(newInStock.getStock());
                stock.setNumber(deleteNumber);
                stock.setWorth(deleteNumber*newInStock.getWorth());
                stockService.outStock(stock);
            } else {
                // List<InOutStock> inOutStocks = inOutStockService.queryInOutStockByInStockId();
                // TODO 已经出库了
            }

        } else if (oldInStock.getNumber() < newInStock.getNumber()) {// 增加
            InStockMapper.modifyInStockById(newInStock);

            Stock stock = new Stock();
            stock.setId(newInStock.getStock());
            stock.setNumber(newInStock.getNumber() - oldInStock.getNumber());
            stockService.inStock(stock);
        } else {
            InStockMapper.modifyInStockById(newInStock);
        }
    }

    public List<InStock> listAllInStocks() {
        return InStockMapper.listAllInStocks();
    }

    public InStock queryInStockById(Integer id) {
        return InStockMapper.queryInStockById(id);
    }
}
