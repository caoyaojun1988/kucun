package com.cao.stock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.InOutStock;
import com.cao.stock.domain.InStock;
import com.cao.stock.domain.OutStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.Stock;
import com.cao.stock.domain.StockDetail;
import com.cao.stock.domain.StockOrder;
import com.cao.stock.persistence.InOutStockMapper;
import com.cao.stock.persistence.InStockMapper;
import com.cao.stock.persistence.OutStockMapper;
import com.cao.stock.persistence.StockMapper;
import com.cao.stock.persistence.StockOrderMapper;
import com.cao.stock.service.util.NumberFormatHelper;
import com.cao.stock.service.util.PinYinHelper;

/**
 * TODO Comment of StockService
 * 
 * @author caoyaojun
 */
@Service
public class StockService {

    @Autowired
    private StockMapper      stockMapper;
    @Autowired
    private InStockMapper    inStockMapper;
    @Autowired
    private OutStockMapper   outStockMapper;
    @Autowired
    private InOutStockMapper inOutStockMapper;
    @Autowired
    private StockOrderMapper stockOrderMapper;

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
        stock.setPinyinForName(stock.getId() + "," + PinYinHelper.convert(stock.getName()));

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

    @Transactional
    public List<StockDetail> listDetail(Integer stockId) {
        List<StockDetail> stockDetails = stockMapper.listDetailById(stockId);
        int number = 0;
        for (StockDetail stockDetail : stockDetails) {
            if (stockDetail.getInOrOut().equals("1")) {
                number = number + stockDetail.getNumber();
            } else {
                number = number - stockDetail.getNumber();
            }
            stockDetail.setRemainderNumber(number);
        }
        return stockDetails;
    }

    @Transactional
    public void replayAll(Integer stockId) {
        QueryParameter queryParameter = new QueryParameter();
        queryParameter.setStock(stockId);
        List<InStock> inStocks = inStockMapper.listAllInStocks(queryParameter);
        List<OutStock> outStocks = outStockMapper.listAllOutStocks(queryParameter);

        double stockWorth = 0D;
        int compensationNumber = 0;

        // 修正instock
        for (InStock currentInStock : inStocks) {
            // 正常入庫
            if (currentInStock.getNumber() >= 0) {
                currentInStock.setTotalWorth(NumberFormatHelper.format(currentInStock.getWorth()
                                                                       * currentInStock.getNumber()));
                stockWorth += currentInStock.getTotalWorth();
                inStockMapper.modifyInStockById(currentInStock);
                // 需要补偿
                if (compensationNumber > 0) {
                    if (currentInStock.getNumber() >= compensationNumber) {
                        stockWorth = stockWorth - compensationNumber * currentInStock.getWorth();
                        compensationNumber = 0;
                    } else if (currentInStock.getNumber() < compensationNumber) {
                        stockWorth = stockWorth - currentInStock.getNumber() * currentInStock.getWorth();
                        compensationNumber = compensationNumber - currentInStock.getNumber();
                    }
                }
            } else {
                compensationNumber += currentInStock.getNumber();
            }
        }
        // 修改outstock
        for (OutStock outStock : outStocks) {
            Integer outStockId = outStock.getId();
            List<InOutStock> inOutStocks = inOutStockMapper.queryInOutStockByOutStockId(outStockId);
            double outWorth = 0;
            for (InOutStock inOutStock : inOutStocks) {
                Integer inStockId = inOutStock.getInStock();
                InStock inStock = inStockMapper.queryInStockById(inStockId);
                double worth = NumberFormatHelper.format(inStock.getWorth() * inOutStock.getNumber());
                inOutStock.setWorth(worth);
                outWorth += worth;
                inOutStockMapper.modifyInOutStockById(inOutStock);
            }
            outStock.setWorth(outWorth);
            outStockMapper.modifyOutStockById(outStock);
            stockWorth = stockWorth - outWorth;
        }
        Stock stock = new Stock();
        stock.setId(stockId);
        stock.setWorth(stockWorth);
        stockMapper.modifyStockById(stock);
    }

    @Transactional
    public void replayOrder() {
        List<StockOrder> orders = stockOrderMapper.listAllInStockOrders(new QueryParameter());
        for (StockOrder stockOrder : orders) {
            StockOrder newStockOrder = inStockMapper.sumInStockByOrderId(stockOrder.getId());
            stockOrderMapper.modifyStockOrderByid(newStockOrder);
        }

        orders = stockOrderMapper.listAllOutStockOrders(new QueryParameter());
        for (StockOrder stockOrder : orders) {
            StockOrder newStockOrder = outStockMapper.sumInStockByOrderId(stockOrder.getId());
            stockOrderMapper.modifyStockOrderByid(newStockOrder);
        }
    }

}
