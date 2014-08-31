package com.cao.stock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.StockOrder;
import com.cao.stock.persistence.StockOrderMapper;

/**
 * TODO Comment of InStockService
 * 
 * @author caoyaojun
 */
@Service
public class StockOrderService {

    @Autowired
    private StockOrderMapper stockOrderMapper;

    @Transactional
    public List<StockOrder> listAllInStockOrders(QueryParameter queryParameter) {
        return stockOrderMapper.listAllInStockOrders(queryParameter);
    }

    @Transactional
    public int countAllInStockOrders(QueryParameter queryParameter) {
        return stockOrderMapper.countAllInStockOrders(queryParameter);
    }

    @Transactional
    public List<StockOrder> listAllOutStockOrders(QueryParameter queryParameter) {
        return stockOrderMapper.listAllOutStockOrders(queryParameter);
    }

    @Transactional
    public int countAllOutStockOrders(QueryParameter queryParameter) {
        return stockOrderMapper.countAllOutStockOrders(queryParameter);
    }

    @Transactional
    public StockOrder queryStockOrderById(String id) {
        return stockOrderMapper.queryStockOrderById(id);
    }

    @Transactional
    public void addStockOrder(StockOrder stockOrder) {
        stockOrderMapper.addStockOrder(stockOrder);
    }

    @Transactional
    public void deleteStockByUid(StockOrder stockOrder) {
        stockOrderMapper.deleteStockByUid(stockOrder);
    }

    @Transactional
    public void modifyStockOrderByid(StockOrder stockOrder) {
        stockOrderMapper.modifyStockOrderByid(stockOrder);
    }
}
