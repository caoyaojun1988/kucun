package com.cao.stock.web.control;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cao.stock.domain.Stock;
import com.cao.stock.service.StockService;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/stock")
public class StockController {

    @Autowired
    private StockService       stockService;
    @Autowired
    private HttpServletRequest request;

    @RequestMapping("/listAll")
    public @ResponseBody
    List<Stock> listAllStocks() {
        List<Stock> stocks = stockService.listAllStocks();
        return stocks;
    }

    @RequestMapping("/add")
    public @ResponseBody
    Result addStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<Stock> stocks = parseJson.parse(parameter, Stock.class);
            for (Stock stock : stocks) {
                if (stock == null || stock.getId() == null || StringUtils.isBlank(stock.getName())) {
                    continue;
                }
                stockService.addOrModifyStock(stock);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/delete")
    public @ResponseBody
    Result deleteStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<Stock> stocks = parseJson.parse(parameter, Stock.class);
            for (Stock stock : stocks) {
                if (stock == null || stock.getId() == null) {
                    continue;
                }
                stockService.deleteStockByUid(stock.getUid());
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/update")
    public @ResponseBody
    Result updateStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<Stock> stocks = parseJson.parse(parameter, Stock.class);
            for (Stock stock : stocks) {
                if (stock == null || stock.getId() == null || StringUtils.isBlank(stock.getName())) {
                    continue;
                }
                stockService.addOrModifyStock(stock);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    public void setStockService(StockService stockService) {
        this.stockService = stockService;
    }

    public StockService getStockService() {
        return stockService;
    }

}
