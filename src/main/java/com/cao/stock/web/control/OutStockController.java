package com.cao.stock.web.control;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cao.stock.domain.OutStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.service.OutStockService;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/outStock")
public class OutStockController {

    @Autowired
    private OutStockService    outStockService;

    @Autowired
    private HttpServletRequest request;

    @RequestMapping("/listAll")
    public @ResponseBody
    HashMap<String, Object> listAllOutStocks(@ModelAttribute("pojo") QueryParameter queryParameter) {
        List<OutStock> stocks = outStockService.listAllOutStocks(queryParameter);
        int count = outStockService.countAllOutStocks(queryParameter);
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("rows", stocks);
        result.put("total", count);
        result.put("success", true);
        return result;
    }

    @RequestMapping("/add")
    public @ResponseBody
    Result addOutStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<OutStock> outStocks = parseJson.parse(parameter, OutStock.class);
            String orderId = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
            for (OutStock outStock : outStocks) {
                if (outStock != null && outStock.getStock() != null) {
                    outStock.setOrderId(orderId);
                    outStockService.addOutStock(outStock);
                }
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/update")
    public @ResponseBody
    Result updateOutStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<OutStock> outStocks = parseJson.parse(parameter, OutStock.class);

            String orderId = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
            for (OutStock outStock : outStocks) {
                if (outStocks == null || outStock.getStock() == null) {
                    continue;
                }
                OutStock oldOutStock = outStockService.queryOutStockById(outStock.getId());

                if (oldOutStock == null || oldOutStock.getId() == null) {
                    outStock.setOrderId(orderId);
                    outStockService.addOutStock(outStock);
                } else {
                    outStockService.modifyOutStock(oldOutStock, outStock);
                }
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/delete")
    public @ResponseBody
    Result deleteOutStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<OutStock> outStocks = parseJson.parse(parameter, OutStock.class);
            for (OutStock outStock : outStocks) {
                if (outStock == null || outStock.getId() == null) {
                    continue;
                }
                OutStock oldOutStock = outStockService.queryOutStockById(outStock.getId());

                outStock.setNumber(0);
                outStock.setWorth(0D);
                outStockService.modifyOutStock(oldOutStock, outStock);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

}
