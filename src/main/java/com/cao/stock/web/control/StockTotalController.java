package com.cao.stock.web.control;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cao.stock.domain.CategoryTotal;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.StockTotal;
import com.cao.stock.service.StockTotalService;

@Controller
@RequestMapping("/stockTotal")
public class StockTotalController {

    @Autowired
    private StockTotalService stockTotalService;

    @RequestMapping("/listInStock")
    public @ResponseBody
    HashMap<String, Object> listInStocks(@ModelAttribute("pojo") QueryParameter queryParameter) {
        List<StockTotal> stocks = stockTotalService.listInStocks(queryParameter);
        int count = stockTotalService.countInStocks(queryParameter);
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("rows", stocks);
        result.put("total", count);
        result.put("success", true);
        return result;
    }

    @RequestMapping("/listOutStock")
    public @ResponseBody
    HashMap<String, Object> listOutStocks(@ModelAttribute("pojo") QueryParameter queryParameter) {
        List<StockTotal> stocks = stockTotalService.listOutStocks(queryParameter);
        int count = stockTotalService.countOutStocks(queryParameter);
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("rows", stocks);
        result.put("total", count);
        result.put("success", true);
        return result;
    }

    @RequestMapping("/listOutStocksByDepartment")
    public @ResponseBody
    HashMap<String, Object> listOutStocksByDepartment(@ModelAttribute("pojo") QueryParameter queryParameter) {
        List<StockTotal> stocks = stockTotalService.listOutStocksByDepartment(queryParameter);
        int count = stockTotalService.countOutStocksByDepartment(queryParameter);
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("rows", stocks);
        result.put("total", count);
        result.put("success", true);
        return result;
    }

    @RequestMapping("/listStocksByCategory")
    public @ResponseBody
    HashMap<String, Object> listStocksByCategory(@ModelAttribute("pojo") QueryParameter queryParameter) {
        List<CategoryTotal> stocks = stockTotalService.listStocksByCategory(queryParameter);
        int count = stockTotalService.countStocksByCategory(queryParameter);
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("rows", stocks);
        result.put("total", count);
        result.put("success", true);
        return result;
    }

    public void setStockTotalService(StockTotalService stockTotalService) {
        this.stockTotalService = stockTotalService;
    }

    public StockTotalService getStockTotalService() {
        return stockTotalService;
    }

}
