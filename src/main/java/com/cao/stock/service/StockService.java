package com.cao.stock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.Stock;
import com.cao.stock.persistence.StockMapper;

/**
 * TODO Comment of StockService
 * 
 * @author caoyaojun
 */
@Service
public class StockService {

    @Autowired
    private StockMapper stockMapper;

    public List<Stock> listAllStocks(QueryParameter queryParameter) {
        return stockMapper.listAllStocks(queryParameter);
    }

    public Integer countAllStocks(QueryParameter queryParameter) {
        return stockMapper.countAllStocks(queryParameter);
    }

    public Stock queryStockByUid(Integer uid) {
        return stockMapper.queryStockByUid(uid);
    }

    @Transactional
    public Stock addOrModifyStock(Stock stock) {
        Stock addStock = stockMapper.queryStockByUid(stock.getUid());
        if (addStock == null || addStock.getId() == null) {
            stock.setStatus("normal");
            stockMapper.addStock(stock);
        } else {
            stockMapper.modifyStockByUid(stock);
        }
        return stockMapper.queryStockByUid(stock.getUid());
    }

    @Transactional
    public Stock inStock(Stock stock) {
        Stock oldStock = stockMapper.queryStockById(stock.getId());
        if (oldStock == null || oldStock.getId() == null) {
            stock.setStatus("normal");
            stockMapper.addStock(stock);
        } else {
            oldStock.setNumber(oldStock.getNumber() + stock.getNumber());
            oldStock.setWorth(oldStock.getWorth() + stock.getWorth());
            stockMapper.modifyStockByUid(oldStock);
        }
        return stockMapper.queryStockByUid(stock.getUid());
    }

    @Transactional
    public Stock outStock(Stock stock) {
        Stock oldStock = stockMapper.queryStockById(stock.getId());
        if (oldStock == null || oldStock.getId() == null) {
            stockMapper.addStock(stock);
        } else {
            oldStock.setNumber(oldStock.getNumber() - stock.getNumber());
            oldStock.setWorth(oldStock.getWorth() - stock.getWorth());
            stockMapper.modifyStockByUid(oldStock);
        }
        return stockMapper.queryStockByUid(stock.getUid());
    }

    @Transactional
    public void deleteStockByUid(Integer uid) {
        Stock oldStock = stockMapper.queryStockByUid(uid);
        if (oldStock != null && oldStock.getNumber() == 0) {
            stockMapper.deleteStockByUid(uid);
        }
    }

}
