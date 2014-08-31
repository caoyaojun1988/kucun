package com.cao.stock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cao.stock.domain.CategoryTotal;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.StockTotal;
import com.cao.stock.persistence.StockTotalMapper;

/**
 * TODO Comment of StockService
 * 
 * @author caoyaojun
 */
@Service
public class StockTotalService {

    @Autowired
    private StockTotalMapper stockTotalMapper;

    public List<StockTotal> listInStocks(QueryParameter queryParameter) {
        return stockTotalMapper.listInStocks(queryParameter);
    }

    public Integer countInStocks(QueryParameter queryParameter) {
        return stockTotalMapper.countInStocks(queryParameter);
    }

    public List<StockTotal> listOutStocks(QueryParameter queryParameter) {
        return stockTotalMapper.listOutStocks(queryParameter);
    }

    public Integer countOutStocks(QueryParameter queryParameter) {
        return stockTotalMapper.countOutStocks(queryParameter);
    }

    public List<StockTotal> listOutStocksByDepartment(QueryParameter queryParameter) {
        return stockTotalMapper.listOutStocksByDepartment(queryParameter);
    }

    public Integer countOutStocksByDepartment(QueryParameter queryParameter) {
        return stockTotalMapper.countOutStocksByDepartment(queryParameter);
    }

    public List<CategoryTotal> listStocksByCategory(QueryParameter queryParameter) {
        return stockTotalMapper.listStocksByCategory(queryParameter);
    }

    public Integer countStocksByCategory(QueryParameter queryParameter) {
        return stockTotalMapper.countStocksByCategory(queryParameter);
    }

}
