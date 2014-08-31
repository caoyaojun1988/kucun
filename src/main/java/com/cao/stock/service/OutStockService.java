package com.cao.stock.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.InStock;
import com.cao.stock.domain.OutStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.Stock;
import com.cao.stock.domain.StockOrder;
import com.cao.stock.persistence.OutStockMapper;

/**
 * TODO Comment of OutStockService
 * 
 * @author caoyaojun
 */
@Service
public class OutStockService {

    @Autowired
    private OutStockMapper    OutStockMapper;
    @Autowired
    private InOutStockService inOutStockService;
    @Autowired
    private StockService      stockService;

    /**
     * 出库
     * 
     * @param OutStock
     */
    @Transactional
    public void addOutStock(OutStock outStock) {
        OutStock oldOutStock = OutStockMapper.queryOutStockById(outStock.getId());
        outStock.setModifyDate(new Date());
        if (oldOutStock == null || oldOutStock.getId() == null) {
            // 订单表 先要拿到id
            OutStockMapper.addOutStock(outStock);
            // 添加明细
            double worth = inOutStockService.addOutStock(outStock);
            // 修改库存
            Stock stock = new Stock();
            stock.setId(outStock.getStock());
            stock.setNumber(outStock.getNumber());
            stock.setWorth(worth);
            stockService.outStock(stock);
            // 修改订单
            outStock.setWorth(worth);
            OutStockMapper.modifyOutStockById(outStock);
        } else {
            throw new RuntimeException("addOutStock is exist");
        }
    }

    /**
     * 出库
     * 
     * @param OutStock
     */
    @Transactional
    public void addInOutStock(OutStock outStock, InStock inStock) {
        OutStock oldOutStock = OutStockMapper.queryOutStockById(outStock.getId());
        outStock.setModifyDate(new Date());
        if (oldOutStock == null || oldOutStock.getId() == null) {
            // 订单表 先要拿到id
            OutStockMapper.addOutStock(outStock);
            // 添加明细
            inOutStockService.addInOutStock(outStock, inStock);
        } else {
            throw new RuntimeException("addOutStock is exist");
        }
    }

    /**
     * 修改出庫單
     * 
     * @param OutStock
     * @return
     */
    @Transactional
    public void modifyOutStock(OutStock oldOutStock, OutStock newOutStock) {
        if (oldOutStock.getNumber() == newOutStock.getNumber()) {
            newOutStock.setModifyDate(new Date());
            OutStockMapper.modifyOutStockById(newOutStock);
            return;
        }

        if (oldOutStock.getNumber() > newOutStock.getNumber()) { // 減少
            OutStock diffOutStock = new OutStock();
            diffOutStock.setId(newOutStock.getId());
            diffOutStock.setNumber(oldOutStock.getNumber() - newOutStock.getNumber());
            // delete 明细
            double worth = inOutStockService.deleteOutStock(diffOutStock);
            // 修改库存
            Stock stock = new Stock();
            stock.setId(newOutStock.getStock());
            stock.setNumber(diffOutStock.getNumber());
            stock.setWorth(worth);
            stockService.inStock(stock);
            // 订单表
            newOutStock.setWorth(oldOutStock.getWorth() - worth);
            newOutStock.setModifyDate(new Date());
            OutStockMapper.modifyOutStockById(newOutStock);
        } else if (oldOutStock.getNumber() < newOutStock.getNumber()) {// 增加
            OutStock diffOutStock = new OutStock();
            diffOutStock.setOrderId(oldOutStock.getOrderId());
            diffOutStock.setStock(oldOutStock.getStock());
            diffOutStock.setNumber(newOutStock.getNumber() - oldOutStock.getNumber());
            diffOutStock.setWorth(oldOutStock.getWorth());
            diffOutStock.setCreateDate(new Date());
            addOutStock(diffOutStock);
        }
    }

    public List<OutStock> listAllOutStocks(QueryParameter queryParameter) {
        return OutStockMapper.listAllOutStocks(queryParameter);
    }

    public Integer countAllOutStocks(QueryParameter queryParameter) {
        return OutStockMapper.countAllOutStocks(queryParameter);
    }

    public OutStock queryOutStockById(Integer id) {
        return OutStockMapper.queryOutStockById(id);
    }

    public StockOrder sumInStockByOrderId(String orderId) {
        return OutStockMapper.sumInStockByOrderId(orderId);
    }

}
