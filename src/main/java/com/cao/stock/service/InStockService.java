package com.cao.stock.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.InOutStock;
import com.cao.stock.domain.InStock;
import com.cao.stock.domain.OutStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.Stock;
import com.cao.stock.domain.StockOrder;
import com.cao.stock.persistence.InOutStockMapper;
import com.cao.stock.persistence.InStockMapper;
import com.cao.stock.persistence.OutStockMapper;
import com.cao.stock.persistence.StockOrderMapper;
import com.cao.stock.service.util.NumberFormatHelper;

/**
 * TODO Comment of InStockService
 * 
 * @author caoyaojun
 */
@Service
public class InStockService {

    @Autowired
    private InStockMapper    inStockMapper;
    @Autowired
    private StockOrderMapper stockOrderMapper;
    @Autowired
    private InOutStockMapper inOutStockMapper;
    @Autowired
    private OutStockMapper   outStockMapper;
    @Autowired
    private StockService     stockService;
    @Autowired
    private OutStockService  outStockService;

    @Transactional
    public void addInStock(InStock inStock) {
        insertInStock(inStock);

        Stock stock = new Stock();
        stock.setId(inStock.getStock());
        stock.setNumber(inStock.getNumber());
        stock.setWorth(NumberFormatHelper.format(inStock.getWorth() * inStock.getNumber()));
        stockService.inStock(stock);
    }

    @Transactional
    public void addInOutStock(InStock inStock, Integer inOutStockStaff, Integer inOutDepartment) {
        inStock = insertInStock(inStock);

        OutStock outStock = new OutStock();
        outStock.setCreateDate(inStock.getCreateDate());
        outStock.setModifyDate(new Date());
        outStock.setNumber(inStock.getNumber());
        outStock.setOrderId(inStock.getOrderId());
        outStock.setStock(inStock.getStock());
        outStock.setWorth(NumberFormatHelper.format(inStock.getNumber() * inStock.getWorth()));

        outStockService.addInOutStock(outStock, inStock);
    }

    private InStock insertInStock(InStock inStock) {
        InStock oldInStock = inStockMapper.queryInStockById(inStock.getId());
        if (oldInStock != null && oldInStock.getId() != null) {
            throw new RuntimeException("addInStock is exist");
        }
        inStock.setModifyDate(new Date());
        inStock.setRemainderNumber(inStock.getNumber());
        inStock.setStatus("in");
        inStockMapper.addInStock(inStock);
        return inStock;
    }

    @Transactional
    public void modifyInStock(InStock oldInStock, InStock newInStock) {
        newInStock.setModifyDate(new Date());
        if (oldInStock.getNumber() > newInStock.getNumber()) {// 撤銷
            int deleteNumber = oldInStock.getNumber() - newInStock.getNumber();
            if (deleteNumber <= oldInStock.getRemainderNumber()) { // 可撤销
                if (newInStock.getNumber() == 0) {
                    inStockMapper.logicDeleteInStockById(newInStock.getId());
                } else {
                    newInStock.setRemainderNumber(newInStock.getRemainderNumber() - deleteNumber);
                    inStockMapper.modifyInStockById(newInStock);
                }
                Stock stock = new Stock();
                stock.setId(newInStock.getStock());
                stock.setNumber(deleteNumber);
                stock.setWorth(NumberFormatHelper.format(deleteNumber * newInStock.getWorth()));
                stockService.outStock(stock);
            } else {
                throw new RuntimeException("已经出库不能撤销"); // TODO 已经出库了
            }
        } else if (oldInStock.getNumber() < newInStock.getNumber()) {// 增加
            newInStock.setRemainderNumber(newInStock.getRemainderNumber()
                                          + (newInStock.getNumber() - oldInStock.getNumber()));
            inStockMapper.modifyInStockById(newInStock);

            Stock stock = new Stock();
            stock.setId(newInStock.getStock());
            stock.setNumber(newInStock.getNumber() - oldInStock.getNumber());
            stock.setWorth(NumberFormatHelper.format(stock.getNumber() * newInStock.getWorth()));
            stockService.inStock(stock);
        } else {
            inStockMapper.modifyInStockById(newInStock);
        }
        // 修改金额
        stockService.replayAll(oldInStock.getStock());
        // 修改订单
        StockOrder newStockOrder = inStockMapper.sumInStockByOrderId(oldInStock.getOrderId());
        stockOrderMapper.modifyStockOrderByid(newStockOrder);
        // 出库
        List<InOutStock> inOutStocks = inOutStockMapper.queryInOutStockByInStockId(oldInStock.getId());
        for (InOutStock inOutStock : inOutStocks) {
            OutStock outStock = outStockMapper.queryOutStockById(inOutStock.getOutStock());
            newStockOrder = outStockMapper.sumInStockByOrderId(outStock.getOrderId());
            stockOrderMapper.modifyStockOrderByid(newStockOrder);
        }
    }

    public List<InStock> listAllInStocks(QueryParameter queryParameter) {
        return inStockMapper.listAllInStocks(queryParameter);
    }

    public Integer countAllInStocks(QueryParameter queryParameter) {
        return inStockMapper.countAllInStocks(queryParameter);
    }

    public InStock queryInStockById(Integer id) {
        return inStockMapper.queryInStockById(id);
    }

    public StockOrder sumInStockByOrderId(String orderId) {
        return inStockMapper.sumInStockByOrderId(orderId);
    }
}
