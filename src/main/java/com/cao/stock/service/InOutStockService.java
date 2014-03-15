package com.cao.stock.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.InOutStock;
import com.cao.stock.domain.InStock;
import com.cao.stock.domain.OutStock;
import com.cao.stock.persistence.InOutStockMapper;
import com.cao.stock.persistence.InStockMapper;

/**
 * TODO Comment of InOutStockService
 * 
 * @author caoyaojun
 */
@Service
public class InOutStockService {

    @Autowired
    private InOutStockMapper inOutStockMapper;
    @Autowired
    private InStockMapper    inStockMapper;

    /**
     * 添加出庫明細
     * 
     * @param outStock
     * @return
     */
    @Transactional
    public double deleteOutStock(OutStock outStock) {
        List<InOutStock> inOutStocks = inOutStockMapper.queryInOutStockByOutStockId(outStock.getId());
        if (inOutStocks == null || inOutStocks.isEmpty()) {
            throw new RuntimeException("deleteOutStock : but out stock not exist");
        }
        double worth = 0;
        int rnumber = outStock.getNumber();
        for (InOutStock inOutStock : inOutStocks) {
            if (inOutStock.getNumber() == rnumber) {

                inOutStockMapper.deleteInOutStockById(inOutStock.getId());

                InStock inStock = inStockMapper.queryInStockById(inOutStock.getInStock());

                if (inStock.getStatus().equals("in")) {
                    throw new RuntimeException("system error");
                }
                worth = worth + rnumber * inStock.getWorth();

                inStock.setModifyDate(new Date());
                inStock.setRemainderNumber(inStock.getRemainderNumber() + rnumber);
                inStock.setStatus("inout");
                inStockMapper.modifyInStockById(inStock);
                break;
            } else if (inOutStock.getNumber() > rnumber) {
                InStock inStock = inStockMapper.queryInStockById(inOutStock.getInStock());

                if (inStock.getStatus().equals("in")) {
                    throw new RuntimeException("system error");
                }

                inOutStock.setNumber(inOutStock.getNumber() - rnumber);
                inOutStock.setWorth(inOutStock.getNumber() * inStock.getWorth());
                inOutStockMapper.modifyInOutStockById(inOutStock);

                worth = worth + rnumber * inStock.getWorth();

                inStock.setModifyDate(new Date());
                inStock.setRemainderNumber(inStock.getRemainderNumber() + rnumber);
                inStock.setStatus("inout");
                inStockMapper.modifyInStockById(inStock);
                break;
            } else {

                inOutStockMapper.deleteInOutStockById(inOutStock.getId());

                InStock inStock = inStockMapper.queryInStockById(inOutStock.getInStock());
                if (inStock.getStatus().equals("in")) {
                    throw new RuntimeException("system error");
                }

                worth = worth + inOutStock.getNumber() * inStock.getWorth();
                rnumber = rnumber - inOutStock.getNumber();//

                inStock.setModifyDate(new Date());
                inStock.setRemainderNumber(inStock.getRemainderNumber() + inOutStock.getNumber());
                if (inStock.getRemainderNumber() == inStock.getNumber()) {
                    inStock.setStatus("in");
                } else {
                    inStock.setStatus("inout");
                }

                inStockMapper.modifyInStockById(inStock);

            }
        }
        return worth;
    }

    /**
     * 添加出庫明細
     * 
     * @param outStock
     * @return
     */
    @Transactional
    public double addOutStock(OutStock outStock) {
        List<InOutStock> oldInOutStocks = inOutStockMapper.queryInOutStockByOutStockId(outStock.getId());
        if (oldInOutStocks == null || oldInOutStocks.isEmpty()) {
            double worth = 0;
            List<InStock> inStocks = inStockMapper.listAllInStocksByStock(outStock.getStock());
            int rnumber = outStock.getNumber();
            for (InStock inStock : inStocks) {
                if (inStock.getRemainderNumber() == rnumber) {
                    InOutStock inOutStock = new InOutStock();
                    inOutStock.setInStock(inStock.getId());
                    inOutStock.setNumber(rnumber);
                    inOutStock.setOutStock(outStock.getId());
                    inOutStock.setWorth(rnumber * inStock.getWorth());
                    inOutStockMapper.addInOutStock(inOutStock);

                    worth = worth + inOutStock.getWorth();

                    inStock.setModifyDate(new Date());
                    inStock.setRemainderNumber(0);
                    inStock.setStatus("out");
                    inStockMapper.modifyInStockById(inStock);
                    break;
                } else if (inStock.getRemainderNumber() > rnumber) {
                    InOutStock inOutStock = new InOutStock();
                    inOutStock.setInStock(inStock.getId());
                    inOutStock.setNumber(rnumber);
                    inOutStock.setOutStock(outStock.getId());
                    inOutStock.setWorth(rnumber * inStock.getWorth());
                    inOutStockMapper.addInOutStock(inOutStock);
                    worth = worth + inOutStock.getWorth();

                    inStock.setModifyDate(new Date());
                    inStock.setRemainderNumber(inStock.getRemainderNumber() - rnumber);
                    inStock.setStatus("inout");
                    inStockMapper.modifyInStockById(inStock);
                    break;
                } else {
                    InOutStock inOutStock = new InOutStock();
                    inOutStock.setInStock(inStock.getId());
                    inOutStock.setNumber(inStock.getRemainderNumber());
                    inOutStock.setOutStock(outStock.getId());
                    inOutStock.setWorth(inStock.getRemainderNumber() * inStock.getWorth());
                    inOutStockMapper.addInOutStock(inOutStock);
                    worth = worth + inOutStock.getWorth();
                    rnumber = rnumber - inStock.getRemainderNumber();// 先减去update之后变化了

                    inStock.setModifyDate(new Date());
                    inStock.setRemainderNumber(0);
                    inStock.setStatus("out");
                    inStockMapper.modifyInStockById(inStock);

                }
            }
            return worth;
        } else {
            throw new RuntimeException("addOutStock old out stock detail exist");
        }
    }
}
